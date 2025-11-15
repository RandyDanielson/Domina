# Product Requirements Document (PRD)
## Tab Grouper by Domain - Browser Extension

**Version:** 1.0.0
**Last Updated:** 2025-11-15
**Status:** Active Development
**Product Type:** Browser Extension (Chromium-based browsers)

---

## 1. Executive Summary

**Tab Grouper by Domain** is a browser extension designed to help users manage their browser tabs more efficiently by organizing them into domain-based groups. The extension provides manual control over tab organization, allowing users to group and ungroup tabs with simple clicks, reducing tab clutter and improving browsing productivity.

---

## 2. Problem Statement

### Current Challenges
- **Tab Overload**: Users frequently accumulate dozens or hundreds of open tabs, making it difficult to find specific content
- **Visual Clutter**: Without organization, tab bars become overwhelming and unmanageable
- **Context Switching**: Finding tabs from the same website or project requires manual searching through the tab bar
- **Cognitive Load**: Unorganized tabs increase mental overhead when switching between tasks or projects

### Solution
A lightweight browser extension that groups tabs by their domain name, providing visual organization through colored tab groups with descriptive labels, all controlled manually by the user for maximum flexibility.

---

## 3. Product Goals & Objectives

### Primary Goals
1. **Simplify Tab Management**: Reduce time spent searching for tabs by organizing them into logical domain-based groups
2. **Improve User Productivity**: Enable faster context switching and tab navigation
3. **Provide Manual Control**: Give users full control over when and how tabs are grouped
4. **Maintain Simplicity**: Keep the interface minimal and intuitive

### Success Metrics
- User can group all tabs in under 2 clicks
- Extension load time < 100ms
- Zero performance impact on browser browsing speed
- Support for 100+ tabs without degradation

---

## 4. Target Users

### Primary Audience
- **Power Users**: Individuals who regularly work with 20+ tabs simultaneously
- **Researchers**: People conducting online research across multiple domains
- **Developers**: Software engineers working with documentation, repositories, and tools
- **Students**: Learners managing multiple educational resources
- **Multi-taskers**: Professionals juggling multiple projects or clients

### User Personas
1. **Sarah - Web Developer**
   - Opens 50+ tabs daily (documentation, GitHub, Stack Overflow, localhost)
   - Needs quick access to tabs grouped by project/domain
   - Values keyboard shortcuts and efficient workflows

2. **Mike - Digital Researcher**
   - Conducts deep research requiring tabs from 15+ different domains
   - Needs to organize tabs by topic/domain without losing context
   - Prefers visual organization with color coding

3. **Lisa - Project Manager**
   - Manages multiple client projects simultaneously
   - Opens tabs from various project management tools and communication platforms
   - Needs clear separation between different projects/domains

---

## 5. Current Features & Capabilities

### 5.1 Core Functionality

#### Manual Tab Grouping
- **Group All Tabs**: Groups all tabs across all windows by their domain name
- **Domain-Specific Grouping**: Groups only tabs from the current domain
- **Intelligent Merging**: Adds ungrouped tabs to existing domain groups when available
- **Multi-Window Support**: Works seamlessly across multiple browser windows

#### Tab Ungrouping
- **Ungroup All**: Removes all tab groups in all windows
- **Domain-Specific Ungrouping**: Ungroups only tabs from the current domain
- **Clean Removal**: Preserves tab order when ungrouping

#### Domain Processing
- **Smart Domain Extraction**: Automatically extracts clean domain names from URLs
- **WWW Removal**: Strips "www." prefix for cleaner group labels
- **Protected URLs**: Ignores browser-specific URLs (chrome://, edge://)
- **Error Handling**: Gracefully handles malformed URLs

#### Visual Organization
- **Color Coding**: Assigns unique colors to each domain from a palette of 8 colors
  - Available colors: Grey, Blue, Red, Yellow, Green, Pink, Purple, Cyan
- **Domain Labels**: Groups are labeled with the clean domain name
- **Collapsed State**: Groups default to expanded state for visibility

### 5.2 User Interface

#### Popup Interface
- **Header Section**
  - Extension title and subtitle
  - Clean, professional branding

- **Status Display**
  - Real-time feedback on operations
  - Color-coded status messages (info, success, error)
  - Auto-dismiss after 3 seconds

- **Control Buttons**
  - **Group All Tabs**: Primary action button with folder icon
  - **Ungroup All Tabs**: Secondary action button with open folder icon
  - Loading states during operations
  - Disabled state while processing

- **Information Section**
  - Quick "How it works" guide
  - Four key features highlighted
  - User-friendly bullet points

- **Statistics Dashboard**
  - **Total Tabs**: Count of all tabs in current window
  - **Domains**: Number of unique domains detected
  - **Groups**: Count of active tab groups
  - Real-time updates

- **Footer**
  - Version number display

#### Context Menu Integration
- **Right-Click Menus**: Available on both web pages and extension icon
  - Group All Tabs by Domain
  - Ungroup All Tabs
  - --- (separator) ---
  - Group Tabs from This Domain
  - Ungroup Tabs from This Domain

### 5.3 Technical Implementation

#### Architecture
- **Service Worker Model**: Manifest V3 compliant background service worker
- **Class-Based Design**: Object-oriented architecture for maintainability
- **Event-Driven**: Responsive to user actions via messages and context menu clicks

#### Permissions
- `tabs`: Access and manage browser tabs
- `tabGroups`: Create and manage tab groups
- `activeTab`: Work with currently active tab
- `contextMenus`: Create right-click menu options

#### Browser Compatibility
- Microsoft Edge (Chromium-based)
- Google Chrome
- Other Chromium-based browsers (Brave, Opera, Vivaldi)
- **Not compatible**: Firefox (uses different extension API)

#### Performance Characteristics
- **Lightweight**: Minimal memory footprint
- **Asynchronous**: Non-blocking operations
- **Error Resilient**: Graceful error handling and logging
- **Efficient**: Batch operations for multiple tabs

---

## 6. User Workflows

### Workflow 1: Group All Tabs
```
User opens browser with 30+ tabs
→ User clicks extension icon
→ Popup displays current stats (30 tabs, 8 domains, 0 groups)
→ User clicks "Group All Tabs" button
→ Extension processes all tabs by domain
→ Creates 8 color-coded groups labeled by domain
→ Status shows "Tabs grouped successfully!"
→ Stats update (30 tabs, 8 domains, 8 groups)
```

### Workflow 2: Group Current Domain Only
```
User is on github.com with 5 GitHub tabs open
→ User right-clicks on page
→ Selects "Group Tabs from This Domain"
→ Extension finds all github.com tabs
→ Creates/updates a group for github.com tabs
→ All GitHub tabs now grouped together with blue color
```

### Workflow 3: Ungroup All Tabs
```
User has organized tabs in 10 groups
→ Needs to ungroup for different workflow
→ User clicks extension icon
→ Clicks "Ungroup All Tabs" button
→ Extension removes all groups
→ All tabs returned to ungrouped state
→ Stats show 0 groups
```

### Workflow 4: Context Menu Quick Actions
```
User browsing stackoverflow.com
→ Right-clicks on page
→ Sees Tab Grouper menu options
→ Clicks "Group All Tabs by Domain"
→ All tabs grouped without opening popup
→ Immediate visual organization in tab bar
```

---

## 7. Functional Requirements

### FR-1: Tab Grouping
- **FR-1.1**: System shall group tabs by extracting domain from URL
- **FR-1.2**: System shall support grouping across multiple windows
- **FR-1.3**: System shall merge tabs into existing groups when domain group exists
- **FR-1.4**: System shall only group tabs with matching domains
- **FR-1.5**: System shall skip browser-specific URLs (chrome://, edge://)
- **FR-1.6**: System shall require at least 2 tabs from same domain to create group

### FR-2: Tab Ungrouping
- **FR-2.1**: System shall allow ungrouping all tabs at once
- **FR-2.2**: System shall allow ungrouping tabs by specific domain
- **FR-2.3**: System shall preserve tab order when ungrouping
- **FR-2.4**: System shall handle tabs already ungrouped gracefully

### FR-3: Visual Identification
- **FR-3.1**: System shall assign unique color to each domain
- **FR-3.2**: System shall use consistent color for same domain across sessions
- **FR-3.3**: System shall cycle through 8 predefined colors
- **FR-3.4**: System shall label groups with clean domain name (no "www.")
- **FR-3.5**: System shall default groups to expanded (not collapsed) state

### FR-4: User Interface
- **FR-4.1**: System shall display popup with statistics and controls
- **FR-4.2**: System shall show real-time count of tabs, domains, and groups
- **FR-4.3**: System shall provide visual feedback during operations
- **FR-4.4**: System shall disable buttons during processing
- **FR-4.5**: System shall auto-update stats after operations

### FR-5: Context Menu
- **FR-5.1**: System shall provide context menu on web pages
- **FR-5.2**: System shall provide context menu on extension icon
- **FR-5.3**: System shall support 4 main actions via context menu
- **FR-5.4**: System shall execute actions based on current tab context

### FR-6: Messaging
- **FR-6.1**: System shall communicate between popup and background worker via messages
- **FR-6.2**: System shall respond to 'groupTabs' action message
- **FR-6.3**: System shall respond to 'ungroupTabs' action message
- **FR-6.4**: System shall send success/failure responses

---

## 8. Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1**: Grouping 100 tabs shall complete in < 3 seconds
- **NFR-1.2**: Popup shall load in < 200ms
- **NFR-1.3**: Extension shall not cause noticeable browser slowdown
- **NFR-1.4**: Memory usage shall remain < 50MB during normal operation

### NFR-2: Reliability
- **NFR-2.1**: Extension shall handle errors without crashing browser
- **NFR-2.2**: Failed operations shall not corrupt existing tab groups
- **NFR-2.3**: System shall log errors to console for debugging
- **NFR-2.4**: Extension shall recover gracefully from API failures

### NFR-3: Usability
- **NFR-3.1**: Users shall complete common tasks in ≤ 2 clicks
- **NFR-3.2**: Interface text shall be clear and concise
- **NFR-3.3**: Status messages shall be informative and timely
- **NFR-3.4**: Visual design shall be clean and professional

### NFR-4: Compatibility
- **NFR-4.1**: Extension shall work on Edge 88+
- **NFR-4.2**: Extension shall work on Chrome 88+
- **NFR-4.3**: Extension shall use Manifest V3 specification
- **NFR-4.4**: Extension shall handle browser API variations gracefully

### NFR-5: Security
- **NFR-5.1**: Extension shall request only necessary permissions
- **NFR-5.2**: Extension shall not transmit user data externally
- **NFR-5.3**: Extension shall not execute remote code
- **NFR-5.4**: Extension shall follow browser security best practices

### NFR-6: Maintainability
- **NFR-6.1**: Code shall follow class-based architecture
- **NFR-6.2**: Functions shall be modular and reusable
- **NFR-6.3**: Code shall include error handling
- **NFR-6.4**: Code shall include descriptive comments

---

## 9. Technical Specifications

### 9.1 File Structure
```
Domina/
├── manifest.json          # Extension configuration (Manifest V3)
├── background.js          # Service worker with TabGrouper class
├── popup.html            # Popup UI structure
├── popup.css             # Popup styling
├── popup.js              # PopupController class
├── content.js            # Content script (minimal)
├── icons/                # Extension icons (16, 32, 48, 128px)
├── README.md             # Documentation
└── PRD.md               # This document
```

### 9.2 Key Classes

#### TabGrouper Class (background.js)
**Properties:**
- `domainColors: Map<string, string>` - Maps domains to assigned colors
- `availableColors: string[]` - Array of 8 available color names
- `colorIndex: number` - Current index for color assignment

**Methods:**
- `init()` - Initializes extension and creates context menus
- `createContextMenus()` - Sets up right-click menu options
- `handleContextMenuClick(info, tab)` - Handles context menu selections
- `groupTabsByDomain(tab)` - Groups tabs matching tab's domain
- `ungroupTabsByDomain(tab)` - Ungroups tabs matching tab's domain
- `groupAllExistingTabs()` - Groups all tabs across all windows
- `ungroupAllTabs()` - Removes all tab groups
- `extractDomain(url)` - Extracts clean domain from URL
- `getColorForDomain(domain)` - Returns consistent color for domain

#### PopupController Class (popup.js)
**Methods:**
- `init()` - Initializes popup and binds event listeners
- `groupTabs()` - Sends grouping request to background worker
- `ungroupTabs()` - Sends ungrouping request to background worker
- `updateStatus(message, type)` - Updates status display with feedback
- `updateStats()` - Refreshes tab/domain/group statistics
- `extractDomain(url)` - Extracts clean domain from URL

### 9.3 Data Flow

```
User Action (Popup/Context Menu)
    ↓
Message to Service Worker
    ↓
TabGrouper Class Method Execution
    ↓
Chrome Tab/TabGroups API Calls
    ↓
Browser Updates Tab Groups
    ↓
Response to Popup
    ↓
UI Update (Stats/Status)
```

### 9.4 Color Assignment Logic
```javascript
Colors: ['grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan']
Assignment: Round-robin based on order of domain discovery
Persistence: Maintained in memory during browser session
```

---

## 10. Constraints & Limitations

### Current Limitations
1. **No Automatic Grouping**: Extension requires manual triggering (by design for user control)
2. **Session-Only Color Memory**: Domain color assignments reset when browser restarts
3. **8-Color Limit**: Only 8 colors available; domains beyond 8 will reuse colors
4. **No Custom Rules**: Cannot create custom grouping rules or exceptions
5. **No Tab Filtering**: Cannot selectively group/ungroup specific tabs
6. **Single-Level Grouping**: Only groups by domain, not by subdomain or path
7. **No Persistence**: Group settings don't persist across browser restarts
8. **Chromium Only**: Not compatible with Firefox or Safari

### Technical Constraints
- Depends on Chrome Tab Groups API (requires Chrome 88+/Edge 88+)
- Service worker lifecycle managed by browser (may sleep when idle)
- Cannot group pinned tabs (browser API limitation)
- Limited to browser-provided tab group colors

---

## 11. Future Enhancements (Out of Scope for v1.0)

### Potential Features
1. **Automatic Grouping Mode**: Optional auto-group on tab creation
2. **Persistent Settings**: Remember domain colors across sessions
3. **Custom Color Assignment**: Let users choose colors for specific domains
4. **Keyboard Shortcuts**: Hotkeys for common actions
5. **Subdomain Grouping**: Option to group by subdomain instead of root domain
6. **Group Templates**: Save and restore specific grouping configurations
7. **Tab Filters**: Selectively include/exclude tabs from grouping
8. **Domain Whitelist/Blacklist**: Never group certain domains
9. **Group Collapse Rules**: Auto-collapse groups with many tabs
10. **Export/Import Settings**: Share grouping configurations
11. **Statistics Dashboard**: Detailed usage analytics
12. **Custom Group Names**: Override domain names with user-defined labels
13. **Integration with Tab Suspenders**: Work with memory management extensions
14. **Search Within Groups**: Find specific tabs within groups
15. **Drag-and-Drop Reorganization**: Manual group reordering

---

## 12. Success Criteria

### Launch Criteria (v1.0)
- ✅ Successfully groups tabs by domain across all windows
- ✅ Provides manual control via popup and context menu
- ✅ Displays accurate statistics in real-time
- ✅ Handles errors gracefully without browser crashes
- ✅ Works on Microsoft Edge and Google Chrome
- ✅ Manifest V3 compliant
- ✅ Minimal performance impact (< 100ms operations)
- ✅ Clean, professional UI

### User Acceptance Criteria
- Users can group 50+ tabs in under 3 seconds
- Users can access all features within 2 clicks
- Zero data loss during grouping/ungrouping operations
- Works reliably with 100+ concurrent tabs
- Clear visual feedback for all operations

---

## 13. Risk Assessment

### Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Browser API changes | High | Medium | Monitor Chrome/Edge release notes, maintain API compatibility layer |
| Performance with 500+ tabs | Medium | Low | Implement batching and progress indicators |
| Service worker sleeping during operation | Medium | Low | Implement keepalive mechanisms if needed |
| Color limit reached (>8 domains) | Low | High | Document limitation, consider expanding palette in future |

### User Experience Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Users confused by manual-only mode | Medium | Medium | Clear documentation and UI hints |
| Users lose tab groups on restart | Medium | High | Document behavior, consider persistence in v2.0 |
| Users overwhelmed by grouped tabs | Low | Low | Provide easy ungroup functionality |

---

## 14. Dependencies

### External Dependencies
- **Chrome Extensions API**: Tab and TabGroups APIs
- **Browser Version**: Chromium 88+ (for Tab Groups support)
- **Manifest V3**: Required for modern extension standards

### Internal Dependencies
- None (self-contained extension)

---

## 15. Metrics & Analytics

### Key Performance Indicators (KPIs)
- **Engagement**: Number of grouping operations per user per day
- **Efficiency**: Average time saved in tab navigation
- **Reliability**: Error rate per 1000 operations
- **Adoption**: Number of active users
- **Satisfaction**: User ratings and reviews

### Tracking Points (Future Implementation)
- Count of grouping/ungrouping operations
- Number of tabs grouped per operation
- Number of domains per grouping session
- Context menu vs popup usage ratio
- Error occurrences and types

---

## 16. Documentation Requirements

### User Documentation
- ✅ README.md with installation and usage instructions
- ✅ In-app "How it works" guide in popup
- ✅ Version history

### Technical Documentation
- ✅ Code comments in all source files
- ✅ This PRD document
- ✅ File structure documentation
- ✅ API usage documentation

### Distribution Documentation
- Installation guide for Edge Add-ons store (future)
- Installation guide for Chrome Web Store (future)
- Privacy policy statement (future)
- Terms of service (future)

---

## 17. Compliance & Privacy

### Privacy Considerations
- **No Data Collection**: Extension does not collect or transmit user data
- **Local Processing**: All operations performed locally in browser
- **No External Connections**: No network requests made
- **No Tracking**: No analytics or telemetry implemented

### Permissions Justification
- `tabs`: Required to read tab URLs and properties
- `tabGroups`: Required to create and manage tab groups
- `activeTab`: Required to determine current tab for domain-specific actions
- `contextMenus`: Required to provide right-click menu functionality

---

## 18. Release Plan

### Version 1.0.0 (Current)
**Status**: Active Development
**Features**:
- Manual tab grouping by domain
- Context menu integration
- Popup interface with statistics
- Multi-window support
- Color-coded groups

### Future Versions (Tentative)
- **v1.1.0**: Keyboard shortcuts, settings page
- **v1.2.0**: Persistent color assignments, custom colors
- **v2.0.0**: Automatic grouping mode, advanced filtering
- **v3.0.0**: Cloud sync, cross-device support

---

## 19. Appendix

### Glossary
- **Domain**: The hostname portion of a URL (e.g., "github.com")
- **Tab Group**: Browser feature that visually groups related tabs
- **Service Worker**: Background script in Manifest V3 extensions
- **Context Menu**: Right-click menu in browser
- **Manifest V3**: Latest Chrome extension platform version

### References
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Tab Groups API](https://developer.chrome.com/docs/extensions/reference/tabGroups/)
- [Tabs API](https://developer.chrome.com/docs/extensions/reference/tabs/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

### Change Log
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-15 | Initial PRD creation - documented current capabilities |

---

**Document Owner**: Development Team
**Stakeholders**: Users, Contributors, Extension Store Reviewers
**Review Cycle**: Quarterly or upon major version updates

---

*This PRD represents the current state of the Tab Grouper by Domain extension as of v1.0.0. It serves as the foundation for understanding the product's capabilities, architecture, and future direction.*
