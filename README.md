# Tab Grouper by Domain - Browser Extension

A browser extension that helps you organize tabs by their domain name with manual grouping controls for better organization and productivity.

## Features

- **Manual Tab Grouping**: Group tabs by domain name with one click
- **Domain-Specific Actions**: Group or ungroup tabs from a specific domain
- **Context Menu Integration**: Quick access via right-click menus
- **Color-Coded Groups**: Each domain gets a unique color for easy identification
- **Bulk Operations**: Group or ungroup all tabs at once
- **Real-time Stats**: View tab, domain, and group counts
- **Multi-Window Support**: Works across all browser windows
- **Lightweight**: Minimal performance impact on browsing

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. Open Microsoft Edge
2. Navigate to `edge://extensions/`
3. Enable "Developer mode" in the bottom left corner
4. Click "Load unpacked"
5. Select the `edge-tab-grouper` folder
6. The extension will be installed and ready to use

### Method 2: Manual Installation

1. Download or clone this repository
2. Open Microsoft Edge
3. Go to `edge://extensions/`
4. Turn on "Developer mode"
5. Click "Load unpacked extension"
6. Browse to the extension folder and select it

## How to Use

### Via Popup Interface
1. Click the extension icon in the toolbar
2. Click **"Group All Tabs"** to organize all tabs by domain
3. Click **"Ungroup All Tabs"** to remove all groupings
4. View real-time statistics (tabs, domains, groups)

### Via Context Menu
1. Right-click on any webpage or the extension icon
2. Select from these options:
   - **Group All Tabs by Domain** - Groups all tabs across all windows
   - **Ungroup All Tabs** - Removes all tab groups
   - **Group Tabs from This Domain** - Groups only tabs from current domain
   - **Ungroup Tabs from This Domain** - Ungroups tabs from current domain

## How It Works

- **Manual Control**: Extension operates only when you trigger grouping actions
- **Domain Extraction**: Extracts clean domain names from URLs (removes www. prefix)
- **Smart Grouping**: Groups tabs with the same domain together
- **Color Assignment**: Assigns unique colors to each domain from a palette of 8 colors
- **Multi-Window**: Processes tabs across all browser windows
- **Intelligent Merging**: Adds ungrouped tabs to existing domain groups when available
- **Protected URLs**: Automatically skips browser-specific URLs (chrome://, edge://)

## File Structure

```
edge-tab-grouper/
├── manifest.json       # Extension configuration
├── background.js       # Main tab grouping logic
├── popup.html         # Extension popup interface
├── popup.css          # Popup styling
├── popup.js           # Popup functionality
├── content.js         # Content script (minimal)
├── icons/             # Extension icons (placeholder)
└── README.md          # This file
```

## Permissions

The extension requires the following permissions:

- `tabs`: To access and manage browser tabs
- `tabGroups`: To create and manage tab groups
- `activeTab`: To work with the currently active tab
- `contextMenus`: To provide right-click menu functionality

**Privacy Note**: This extension does not collect, store, or transmit any user data. All operations are performed locally in your browser.

## Browser Compatibility

- Microsoft Edge (Chromium-based)
- Google Chrome (with minor modifications)
- Other Chromium-based browsers

## Development

### Prerequisites

- Microsoft Edge (latest version)
- Basic knowledge of JavaScript, HTML, and CSS

### Local Development

1. Clone the repository
2. Make your changes
3. Load the extension in Edge using Developer mode
4. Test your changes
5. Reload the extension after making changes

### Key Components

- **Background Service Worker** (`background.js`): Handles all tab management logic
- **Popup Interface** (`popup.html`, `popup.css`, `popup.js`): User interface
- **Manifest** (`manifest.json`): Extension configuration and permissions

## Troubleshooting

### Extension Not Working

1. Check that Developer mode is enabled
2. Verify all files are present in the extension folder
3. Check the browser console for errors
4. Try reloading the extension

### Tabs Not Grouping

1. Ensure the extension has proper permissions
2. Check that tab groups are supported in your browser version
3. Look for error messages in the extension popup

### Performance Issues

1. The extension is designed to be lightweight
2. If you experience issues, try ungrouping all tabs and regrouping
3. Check for conflicts with other tab management extensions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Key Capabilities

### Group Management
- **Group All Tabs**: Organizes all tabs across all windows by domain
- **Group by Domain**: Groups only tabs from a specific domain
- **Ungroup All**: Removes all tab groups at once
- **Ungroup by Domain**: Removes groups for a specific domain only

### Visual Organization
- **8 Color Palette**: Grey, Blue, Red, Yellow, Green, Pink, Purple, Cyan
- **Domain Labels**: Groups labeled with clean domain names
- **Consistent Colors**: Same domain always gets the same color (during session)

### Statistics
- **Total Tabs**: Count of all tabs in current window
- **Domains**: Number of unique domains detected
- **Groups**: Count of active tab groups

## Version History

- **v1.0.0**: Initial release with manual domain-based tab grouping, context menus, and multi-window support

## Support

For issues, questions, or feature requests, please create an issue in the repository.
