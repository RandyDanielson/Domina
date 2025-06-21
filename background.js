// Background service worker for Tab Grouper extension
class TabGrouper {
  constructor() {
    this.domainColors = new Map();
    this.availableColors = [
      'grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan'
    ];
    this.colorIndex = 0;
    this.autoGroupEnabled = false;
    this.autoAlphabetizeEnabled = false;
    this.init();
  }

  async init() {
    // Load settings
    await this.loadSettings();
    
    // Set up event listeners
    this.createContextMenus();
    this.setupTabListeners();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['autoGroupEnabled', 'autoAlphabetizeEnabled']);
      this.autoGroupEnabled = result.autoGroupEnabled || false;
      this.autoAlphabetizeEnabled = result.autoAlphabetizeEnabled || false;
    } catch (error) {
      console.error('Error loading settings:', error);
      this.autoGroupEnabled = false;
      this.autoAlphabetizeEnabled = false;
    }
  }

  setupTabListeners() {
    // Listen for new tabs being created
    chrome.tabs.onCreated.addListener((tab) => {
      if (this.autoGroupEnabled) {
        // Small delay to ensure tab is fully loaded
        setTimeout(() => {
          this.autoGroupNewTab(tab);
        }, 500);
      }
    });

    // Listen for tab updates (URL changes)
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (this.autoGroupEnabled && changeInfo.url) {
        // Small delay to ensure tab is fully loaded
        setTimeout(() => {
          this.autoGroupNewTab(tab);
        }, 500);
      }
    });
  }

  createContextMenus() {
    // Remove any existing context menus first
    chrome.contextMenus.removeAll(() => {
      // Create context menu items
      chrome.contextMenus.create({
        id: 'groupAllTabs',
        title: 'Group All Tabs by Domain',
        contexts: ['page', 'action']
      });

      chrome.contextMenus.create({
        id: 'ungroupAllTabs',
        title: 'Ungroup All Tabs',
        contexts: ['page', 'action']
      });

      chrome.contextMenus.create({
        id: 'separator1',
        type: 'separator',
        contexts: ['page', 'action']
      });

      chrome.contextMenus.create({
        id: 'groupCurrentDomain',
        title: 'Group Tabs from This Domain',
        contexts: ['page', 'action']
      });

      chrome.contextMenus.create({
        id: 'ungroupCurrentDomain',
        title: 'Ungroup Tabs from This Domain',
        contexts: ['page', 'action']
      });

      chrome.contextMenus.create({
        id: 'separator2',
        type: 'separator',
        contexts: ['page', 'action']
      });

      chrome.contextMenus.create({
        id: 'alphabetizeGroups',
        title: 'Alphabetize Tab Groups',
        contexts: ['page', 'action']
      });
    });

    // Listen for context menu clicks
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenuClick(info, tab);
    });
  }

  async handleContextMenuClick(info, tab) {
    try {
      switch (info.menuItemId) {
        case 'groupAllTabs':
          await this.groupAllExistingTabs();
          break;
        case 'ungroupAllTabs':
          await this.ungroupAllTabs();
          break;
        case 'groupCurrentDomain':
          await this.groupTabsByDomain(tab);
          break;
        case 'ungroupCurrentDomain':
          await this.ungroupTabsByDomain(tab);
          break;
        case 'alphabetizeGroups':
          await this.alphabetizeTabGroups();
          break;
      }
    } catch (error) {
      console.error('Error handling context menu click:', error);
    }
  }

  async groupTabsByDomain(currentTab) {
    if (!currentTab.url || currentTab.url.startsWith('chrome://') || currentTab.url.startsWith('edge://')) {
      return;
    }

    const domain = this.extractDomain(currentTab.url);
    const color = this.getColorForDomain(domain);

    try {
      // Get all tabs in the current window
      const tabs = await chrome.tabs.query({ windowId: currentTab.windowId });
      
      // Find tabs with the same domain
      const sameDomainTabs = tabs.filter(t => 
        t.url && this.extractDomain(t.url) === domain
      );

      if (sameDomainTabs.length > 1) {
        // Check if any of these tabs are already in a group
        const groupedTabs = sameDomainTabs.filter(t => t.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE);
        
        if (groupedTabs.length > 0) {
          // Use existing group
          const existingGroupId = groupedTabs[0].groupId;
          const ungroupedTabs = sameDomainTabs.filter(t => t.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE);
          
          if (ungroupedTabs.length > 0) {
            await chrome.tabs.group({
              tabIds: ungroupedTabs.map(t => t.id),
              groupId: existingGroupId
            });
          }
        } else {
          // Create new group
          const groupId = await chrome.tabs.group({
            tabIds: sameDomainTabs.map(t => t.id)
          });

          // Update group properties
          await chrome.tabGroups.update(groupId, {
            title: domain,
            color: color,
            collapsed: false
          });
        }
      }
    } catch (error) {
      console.error('Error grouping tabs by domain:', error);
    }
  }

  async ungroupTabsByDomain(currentTab) {
    if (!currentTab.url || currentTab.url.startsWith('chrome://') || currentTab.url.startsWith('edge://')) {
      return;
    }

    const domain = this.extractDomain(currentTab.url);

    try {
      // Get all tabs in the current window
      const tabs = await chrome.tabs.query({ windowId: currentTab.windowId });
      
      // Find tabs with the same domain that are grouped
      const sameDomainTabs = tabs.filter(t => 
        t.url && 
        this.extractDomain(t.url) === domain &&
        t.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE
      );

      // Ungroup all tabs from this domain
      for (const tab of sameDomainTabs) {
        await chrome.tabs.ungroup(tab.id);
      }
    } catch (error) {
      console.error('Error ungrouping tabs by domain:', error);
    }
  }

  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (error) {
      return 'other';
    }
  }

  getColorForDomain(domain) {
    if (!this.domainColors.has(domain)) {
      const color = this.availableColors[this.colorIndex % this.availableColors.length];
      this.domainColors.set(domain, color);
      this.colorIndex++;
    }
    return this.domainColors.get(domain);
  }

  async autoGroupNewTab(tab) {
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      return;
    }

    try {
      const domain = this.extractDomain(tab.url);
      
      // Get all tabs in the same window
      const tabs = await chrome.tabs.query({ windowId: tab.windowId });
      
      // Find other tabs with the same domain
      const sameDomainTabs = tabs.filter(t => 
        t.id !== tab.id && // Exclude the current tab
        t.url && 
        this.extractDomain(t.url) === domain
      );

      if (sameDomainTabs.length > 0) {
        // Check if any of these tabs are already in a group
        const groupedTabs = sameDomainTabs.filter(t => t.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE);
        
        if (groupedTabs.length > 0) {
          // Add to existing group
          const existingGroupId = groupedTabs[0].groupId;
          await chrome.tabs.group({
            tabIds: [tab.id],
            groupId: existingGroupId
          });
        } else {
          // Create new group with all tabs from this domain
          const allDomainTabs = [...sameDomainTabs, tab];
          const color = this.getColorForDomain(domain);
          
          const groupId = await chrome.tabs.group({
            tabIds: allDomainTabs.map(t => t.id)
          });

          await chrome.tabGroups.update(groupId, {
            title: domain,
            color: color,
            collapsed: false
          });

          // Auto-alphabetize if enabled
          if (this.autoAlphabetizeEnabled) {
            setTimeout(() => {
              this.alphabetizeTabGroups();
            }, 100);
          }
        }
      }
    } catch (error) {
      console.error('Error auto-grouping new tab:', error);
    }
  }


  async groupAllExistingTabs() {
    try {
      const windows = await chrome.windows.getAll({ populate: true });
      
      for (const window of windows) {
        const domainGroups = new Map();
        
        // Group tabs by domain
        for (const tab of window.tabs) {
          if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
            const domain = this.extractDomain(tab.url);
            if (!domainGroups.has(domain)) {
              domainGroups.set(domain, []);
            }
            domainGroups.get(domain).push(tab);
          }
        }

        // Create groups for domains with multiple tabs
        for (const [domain, tabs] of domainGroups) {
          if (tabs.length > 1) {
            const color = this.getColorForDomain(domain);
            
            try {
              const groupId = await chrome.tabs.group({
                tabIds: tabs.map(t => t.id)
              });

              await chrome.tabGroups.update(groupId, {
                title: domain,
                color: color,
                collapsed: false
              });
            } catch (error) {
              console.error(`Error creating group for ${domain}:`, error);
            }
          }
        }
      }

      // Auto-alphabetize if enabled
      if (this.autoAlphabetizeEnabled) {
        setTimeout(() => {
          this.alphabetizeTabGroups();
        }, 200);
      }
    } catch (error) {
      console.error('Error grouping existing tabs:', error);
    }
  }

  async ungroupAllTabs() {
    try {
      const windows = await chrome.windows.getAll({ populate: true });
      
      const ungroupPromises = [];
      for (const window of windows) {
        for (const tab of window.tabs) {
          if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
            ungroupPromises.push(chrome.tabs.ungroup(tab.id));
          }
        }
      }
      await Promise.all(ungroupPromises);
    } catch (error) {
      console.error('Error ungrouping tabs:', error);
    }
  }

  async alphabetizeTabGroups() {
    try {
      const windows = await chrome.windows.getAll({ populate: true });
      
      for (const window of windows) {
        // Get all tab groups in the window
        const groups = await chrome.tabGroups.query({ windowId: window.id });
        
        if (groups.length === 0) continue;
        
        // Sort groups alphabetically by title
        const sortedGroups = groups.sort((a, b) => {
          const titleA = a.title || '';
          const titleB = b.title || '';
          return titleA.localeCompare(titleB);
        });
        
        // Get all tabs for each group and move them in alphabetical order
        for (let i = 0; i < sortedGroups.length; i++) {
          const group = sortedGroups[i];
          const groupTabs = await chrome.tabs.query({ 
            windowId: window.id, 
            groupId: group.id 
          });
          
          if (groupTabs.length > 0) {
            // Calculate the target position for this group
            // We'll move each group to position them alphabetically
            const targetIndex = i === 0 ? 0 : await this.calculateGroupPosition(window.id, i);
            
            // Move the first tab of the group to the target position
            // This will move the entire group
            await chrome.tabs.move(groupTabs[0].id, { index: targetIndex });
          }
        }
      }
    } catch (error) {
      console.error('Error alphabetizing tab groups:', error);
    }
  }

  async calculateGroupPosition(windowId, groupIndex) {
    try {
      // Get all tabs in the window
      const allTabs = await chrome.tabs.query({ windowId: windowId });
      
      // Count tabs that are not in groups (they come first)
      const ungroupedTabs = allTabs.filter(tab => tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE);
      
      // Get all groups and sort them alphabetically
      const groups = await chrome.tabGroups.query({ windowId: windowId });
      const sortedGroups = groups.sort((a, b) => {
        const titleA = a.title || '';
        const titleB = b.title || '';
        return titleA.localeCompare(titleB);
      });
      
      // Calculate position: ungrouped tabs + tabs from previous groups
      let position = ungroupedTabs.length;
      
      for (let i = 0; i < groupIndex; i++) {
        const groupTabs = allTabs.filter(tab => tab.groupId === sortedGroups[i].id);
        position += groupTabs.length;
      }
      
      return position;
    } catch (error) {
      console.error('Error calculating group position:', error);
      return 0;
    }
  }
}

// Initialize the tab grouper
const tabGrouper = new TabGrouper();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'groupTabs') {
    (async () => {
      await tabGrouper.groupAllExistingTabs();
      sendResponse({ success: true });
    })();
    return true; // Indicate that the response will be sent asynchronously
  } else if (request.action === 'ungroupTabs') {
    (async () => {
      await tabGrouper.ungroupAllTabs();
      sendResponse({ success: true });
    })();
    return true; // Indicate that the response will be sent asynchronously
  } else if (request.action === 'alphabetizeTabs') {
    (async () => {
      await tabGrouper.alphabetizeTabGroups();
      sendResponse({ success: true });
    })();
    return true; // Indicate that the response will be sent asynchronously
  } else if (request.action === 'setAutoGroup') {
    (async () => {
      tabGrouper.autoGroupEnabled = request.enabled;
      await chrome.storage.sync.set({ autoGroupEnabled: request.enabled });
      sendResponse({ success: true });
    })();
    return true; // Indicate that the response will be sent asynchronously
  } else if (request.action === 'setAutoAlphabetize') {
    (async () => {
      tabGrouper.autoAlphabetizeEnabled = request.enabled;
      await chrome.storage.sync.set({ autoAlphabetizeEnabled: request.enabled });
      sendResponse({ success: true });
    })();
    return true; // Indicate that the response will be sent asynchronously
  }
});
