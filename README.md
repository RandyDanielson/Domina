# Tab Grouper by Domain - Microsoft Edge Extension

A browser extension that automatically groups tabs by their domain name for better organization and productivity.

## Features

- **Automatic Grouping**: Automatically groups tabs by domain name as you browse
- **Color-Coded Groups**: Each domain gets a unique color for easy identification
- **Manual Controls**: Group or ungroup all tabs with one click
- **Real-time Stats**: View tab, domain, and group counts
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

1. **Automatic Grouping**: The extension automatically groups tabs as you browse
2. **Manual Grouping**: Click the extension icon and press "Group All Tabs"
3. **Ungroup Tabs**: Use the "Ungroup All Tabs" button to remove all groupings
4. **View Stats**: See real-time statistics in the popup

## How It Works

- Monitors tab creation and updates
- Extracts domain names from URLs (removes www. prefix)
- Groups tabs with the same domain together
- Assigns unique colors to each domain group
- Provides manual controls through the popup interface

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

## Version History

- **v1.0.0**: Initial release with basic domain-based tab grouping

## Support

For issues, questions, or feature requests, please create an issue in the repository.
