# Component Sync System

This system helps you keep components synchronized between your sandbox project and your main project.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure the target project path:**
   Edit `sync-config.json` and update the `targetProjectPath` to point to your other project's components directory:
   ```json
   {
     "targetProjectPath": "/Users/yourname/path/to/other-project/src/components"
   }
   ```

3. **Customize which components to sync:**
   Update the `componentsToSync` array in `sync-config.json` to include only the components you want to keep in sync.

## Usage

### One-time Sync
To sync all components once:
```bash
npm run sync
```

### Continuous Sync (Watch Mode)
To start watching for changes and automatically sync:
```bash
npm run sync:watch
```

This will:
- Perform an initial sync of all components
- Watch for file changes in the components directory
- Automatically copy changed files to your target project

### Manual Script Usage
You can also run the script directly:
```bash
node sync-components.js sync    # One-time sync
node sync-components.js watch   # Watch mode
```

## What Gets Synced

For each component in your `componentsToSync` list, the system will copy:
- `.jsx` files
- `.scss` files  
- Any other files in the component directory

## File Structure

Your components should be organized like this:
```
src/components/
├── TeaserHero/
│   ├── TeaserHero.jsx
│   ├── TeaserHero.scss
│   └── index.js (if you have one)
├── Header/
│   ├── Header.jsx
│   └── Header.scss
└── ...
```

## Tips

1. **Keep the watcher running** while you develop to ensure changes are immediately synced
2. **Test in both projects** after making changes to ensure compatibility
3. **Use version control** in both projects to track changes and rollback if needed
4. **Consider using relative imports** in your components to make them more portable

## Troubleshooting

- **Permission errors**: Make sure you have write access to the target directory
- **Path not found**: Double-check the `targetProjectPath` in `sync-config.json`
- **Files not syncing**: Ensure the component name is listed in `componentsToSync`

## Alternative Sync Methods

If this script doesn't work for your setup, consider:
1. **Git subtrees/submodules** for version-controlled syncing
2. **Symbolic links** for real-time file sharing
3. **npm/yarn workspaces** for monorepo setups
4. **rsync** for more advanced file synchronization 