// Background service worker for Tab Grouper extension
class TabGrouper {
  constructor() {
    this.domainColors = new Map();
    this.availableColors = [
      'grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan'
    ];
    this.colorIndex = 0;
    this.init();
  }

  init() {
    // Extension is now completely manual - no automatic grouping
    // Users must trigger grouping through the popup interface or context menu
    this.createContextMenus();
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
  }
});
