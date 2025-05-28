# Domina

A browser extension that groups tabs by their domain name for better organization and productivity.

## Features

- **Manual Grouping**: Group all tabs by domain with one click
- **Automatic Grouping**: Optional auto-grouping of new tabs (disabled by default)
- **Context Menu Integration**: Right-click to access grouping options
- **Domain-Specific Controls**: Group or ungroup tabs from specific domains
- **Alphabetical Sorting**: Alphabetize tab groups for better organization
- **Auto-Alphabetize**: Optional automatic alphabetization of groups (disabled by default)
- **Color-Coded Groups**: Each domain gets a unique color for easy identification
- **Real-time Stats**: View tab, domain, and group counts in the popup
- **Lightweight**: Minimal performance impact on browsing

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. Open your Chromium-based browser (Chrome, Edge, etc.)
2. Navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable "Developer mode" 
4. Click "Load unpacked"
5. Select the `Domina` folder
6. The extension will be installed and ready to use

### Method 2: Manual Installation

1. Download or clone this repository
2. Open your Chromium-based browser
3. Go to the extensions page
4. Turn on "Developer mode"
5. Click "Load unpacked extension"
6. Browse to the extension folder and select it

## Pinning the Extension Button

After installation, the Domina extension button should appear in your browser toolbar. If you don't see it:

1. **Chrome**: Click the puzzle piece icon (Extensions) in the toolbar, then click the pin icon next to "Domina"
2. **Edge**: Click the puzzle piece icon (Extensions) in the toolbar, then click the eye icon next to "Domina" to show it
3. **Alternative**: Right-click on the toolbar and look for extension management options

Once pinned, the Domina button will be visible next to the Extensions button for easy access.

## How to Use

### Popup Interface
1. **Auto-group Toggle**: Enable or disable automatic grouping of new tabs (off by default)
2. **Auto-alphabetize Toggle**: Enable or disable automatic alphabetization of groups (off by default)
3. **Group All Tabs**: Click the extension icon and press "Group All Tabs" to organize all tabs by domain
4. **Ungroup All Tabs**: Use the "Ungroup All Tabs" button to remove all groupings
5. **Alphabetize Groups**: Use the "Alphabetize Groups" button to sort tab groups alphabetically by domain name
6. **View Stats**: See real-time statistics showing total tabs, domains, and groups

### Context Menu Options
1. **Right-click on any page** to access grouping options:
   - "Group All Tabs by Domain" - Groups all tabs in the current window
   - "Ungroup All Tabs" - Removes all tab groups
   - "Group Tabs from This Domain" - Groups only tabs from the current domain
   - "Ungroup Tabs from This Domain" - Ungroups only tabs from the current domain
   - "Alphabetize Tab Groups" - Sorts all tab groups alphabetically by domain name

## How It Works

- Extension operates in manual mode by default (automatic features can be enabled)
- When auto-grouping is enabled, new tabs are automatically grouped with existing tabs from the same domain
- When auto-alphabetize is enabled, groups are automatically sorted alphabetically after creation or modification
- Extracts domain names from URLs (removes www. prefix)
- Groups tabs with the same domain together when triggered manually or automatically
- Assigns unique colors to each domain group
- Provides both popup and context menu controls for flexibility

## File Structure

```
Domina/
├── manifest.json       # Extension configuration
├── background.js       # Main tab grouping logic and context menu handling
├── popup.html         # Extension popup interface
├── popup.css          # Popup styling
├── popup.js           # Popup functionality and stats
├── content.js         # Content script (minimal)
├── icons/             # Extension icons
│   ├── icon.svg       # SVG icon source
│   ├── icon16.png     # 16x16 icon
│   ├── icon32.png     # 32x32 icon
│   ├── icon48.png     # 48x48 icon
│   └── icon128.png    # 128x128 icon
└── README.md          # This file
```

## Permissions

The extension requires the following permissions:

- `tabs`: To access and manage browser tabs
- `tabGroups`: To create and manage tab groups
- `activeTab`: To work with the currently active tab
- `contextMenus`: To provide right-click context menu options
- `storage`: To save user preferences (auto-grouping and auto-alphabetize settings)

## Browser Compatibility

- Google Chrome (Chromium-based)
- Microsoft Edge (Chromium-based)
- Other Chromium-based browsers that support tab groups

## Development

### Prerequisites

- Any Chromium-based browser (Chrome, Edge, etc.)
- Basic knowledge of JavaScript, HTML, and CSS

### Local Development

1. Clone the repository
2. Make your changes
3. Load the extension in your browser using Developer mode
4. Test your changes
5. Reload the extension after making changes

### Key Components

- **Background Service Worker** (`background.js`): Handles tab management logic and context menu
- **Popup Interface** (`popup.html`, `popup.css`, `popup.js`): User interface and statistics
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

## Version History

- **v1.0.0**: Initial release with manual domain-based tab grouping and context menu integration

## Support

For issues, questions, or feature requests, please create an issue in the repository.
