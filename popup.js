// Popup script for Tab Grouper extension
class PopupController {
  constructor() {
    this.init();
  }

  init() {
    // Bind event listeners
    document.getElementById('groupTabs').addEventListener('click', () => {
      this.groupTabs();
    });

    document.getElementById('ungroupTabs').addEventListener('click', () => {
      this.ungroupTabs();
    });

    document.getElementById('alphabetizeTabs').addEventListener('click', () => {
      this.alphabetizeTabs();
    });

    document.getElementById('autoGroupToggle').addEventListener('change', (e) => {
      this.toggleAutoGroup(e.target.checked);
    });

    document.getElementById('autoAlphabetizeToggle').addEventListener('change', (e) => {
      this.toggleAutoAlphabetize(e.target.checked);
    });

    // Load initial stats and settings
    this.loadSettings();
    this.updateStats();
  }

  async groupTabs() {
    const button = document.getElementById('groupTabs');
    
    try {
      // Disable button and show loading
      button.disabled = true;
      button.innerHTML = '<span class="loading"></span> Grouping...';
      
      this.updateStatus('Grouping tabs by domain...', 'info');

      // Send message to background script
      const response = await chrome.runtime.sendMessage({ action: 'groupTabs' });
      
      if (response.success) {
        this.updateStatus('Tabs grouped successfully!', 'success');
        setTimeout(() => {
          this.updateStats();
        }, 1000);
      } else {
        this.updateStatus('Failed to group tabs', 'error');
      }
    } catch (error) {
      console.error('Error grouping tabs:', error);
      this.updateStatus('Error occurred while grouping tabs', 'error');
    } finally {
      // Re-enable button
      button.disabled = false;
      button.innerHTML = '<span class="btn-icon">📁</span> Group All Tabs';
      
      // Reset status after 3 seconds
      setTimeout(() => {
        this.updateStatus('Ready to group tabs', '');
      }, 3000);
    }
  }

  async ungroupTabs() {
    const button = document.getElementById('ungroupTabs');
    
    try {
      // Disable button and show loading
      button.disabled = true;
      button.innerHTML = '<span class="loading"></span> Ungrouping...';
      
      this.updateStatus('Ungrouping all tabs...', 'info');

      // Send message to background script
      const response = await chrome.runtime.sendMessage({ action: 'ungroupTabs' });
      
      if (response.success) {
        this.updateStatus('Tabs ungrouped successfully!', 'success');
        setTimeout(() => {
          this.updateStats();
        }, 1000);
      } else {
        this.updateStatus('Failed to ungroup tabs', 'error');
      }
    } catch (error) {
      console.error('Error ungrouping tabs:', error);
      this.updateStatus('Error occurred while ungrouping tabs', 'error');
    } finally {
      // Re-enable button
      button.disabled = false;
      button.innerHTML = '<span class="btn-icon">📂</span> Ungroup All Tabs';
      
      // Reset status after 3 seconds
      setTimeout(() => {
        this.updateStatus('Tabs are ungrouped. Ready for the next action.', '');
      }, 3000);
    }
  }

  updateStatus(message, type) {
    const status = document.getElementById('status');
    const statusText = status.querySelector('.status-text');
    
    statusText.textContent = message;
    
    // Remove existing status classes
    status.classList.remove('success', 'error', 'info');
    
    // Add new status class if provided
    if (type) {
      status.classList.add(type);
    }
  }

  async updateStats() {
    try {
      // Get all tabs in current window
      const tabs = await chrome.tabs.query({ currentWindow: true });
      
      // Count domains and groups
      const domains = new Set();
      const groups = new Set();
      
      tabs.forEach(tab => {
        if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
          try {
            const domain = this.extractDomain(tab.url);
            domains.add(domain);
          } catch (error) {
            // Invalid URL, skip
          }
        }
        
        if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
          groups.add(tab.groupId);
        }
      });

      // Update UI
      document.getElementById('totalTabs').textContent = tabs.length;
      document.getElementById('totalDomains').textContent = domains.size;
      document.getElementById('totalGroups').textContent = groups.size;
      
    } catch (error) {
      console.error('Error updating stats:', error);
      document.getElementById('totalTabs').textContent = '-';
      document.getElementById('totalDomains').textContent = '-';
      document.getElementById('totalGroups').textContent = '-';
    }
  }

  async alphabetizeTabs() {
    const button = document.getElementById('alphabetizeTabs');
    
    try {
      // Disable button and show loading
      button.disabled = true;
      button.innerHTML = '<span class="loading"></span> Alphabetizing...';
      
      this.updateStatus('Alphabetizing tab groups...', 'info');

      // Send message to background script
      const response = await chrome.runtime.sendMessage({ action: 'alphabetizeTabs' });
      
      if (response.success) {
        this.updateStatus('Tab groups alphabetized successfully!', 'success');
        setTimeout(() => {
          this.updateStats();
        }, 1000);
      } else {
        this.updateStatus('Failed to alphabetize tab groups', 'error');
      }
    } catch (error) {
      console.error('Error alphabetizing tabs:', error);
      this.updateStatus('Error occurred while alphabetizing tab groups', 'error');
    } finally {
      // Re-enable button
      button.disabled = false;
      button.innerHTML = '<span class="btn-icon">🔤</span> Alphabetize Groups';
      
      // Reset status after 3 seconds
      setTimeout(() => {
        this.updateStatus('Tab groups are alphabetized. Ready for the next action.', '');
      }, 3000);
    }
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['autoGroupEnabled', 'autoAlphabetizeEnabled']);
      const autoGroupEnabled = result.autoGroupEnabled || false;
      const autoAlphabetizeEnabled = result.autoAlphabetizeEnabled || false;
      
      document.getElementById('autoGroupToggle').checked = autoGroupEnabled;
      document.getElementById('autoAlphabetizeToggle').checked = autoAlphabetizeEnabled;
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async toggleAutoGroup(enabled) {
    try {
      // Save setting
      await chrome.storage.sync.set({ autoGroupEnabled: enabled });
      
      // Send message to background script
      await chrome.runtime.sendMessage({ 
        action: 'setAutoGroup', 
        enabled: enabled 
      });
      
      // Update status
      if (enabled) {
        this.updateStatus('Auto-grouping enabled for new tabs', 'success');
      } else {
        this.updateStatus('Auto-grouping disabled', 'info');
      }
      
      // Reset status after 2 seconds
      setTimeout(() => {
        this.updateStatus('', '');
      }, 2000);
      
    } catch (error) {
      console.error('Error toggling auto-group:', error);
      this.updateStatus('Error updating auto-group setting', 'error');
    }
  }

  async toggleAutoAlphabetize(enabled) {
    try {
      // Save setting
      await chrome.storage.sync.set({ autoAlphabetizeEnabled: enabled });
      
      // Send message to background script
      await chrome.runtime.sendMessage({ 
        action: 'setAutoAlphabetize', 
        enabled: enabled 
      });
      
      // Update status
      if (enabled) {
        this.updateStatus('Auto-alphabetizing enabled for groups', 'success');
      } else {
        this.updateStatus('Auto-alphabetizing disabled', 'info');
      }
      
      // Reset status after 2 seconds
      setTimeout(() => {
        this.updateStatus('', '');
      }, 2000);
      
    } catch (error) {
      console.error('Error toggling auto-alphabetize:', error);
      this.updateStatus('Error updating auto-alphabetize setting', 'error');
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
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.popupController = new PopupController();
});

// Update stats when popup is opened
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Popup became visible, update stats
    setTimeout(() => {
      if (window.popupController) {
        window.popupController.updateStats();
      }
    }, 100);
  }
});

// Store reference for visibility change handler
window.addEventListener('load', () => {
  window.popupController = new PopupController();
});
