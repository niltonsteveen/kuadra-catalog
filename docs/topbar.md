# TopBar components

Two components to compose the storefront top navigation.

- TopBarMenu: horizontal categories with overflow to DropdownMenu.
- TopBarGeneral: logo + menu + search/cart actions; mobile via Drawer.

Data-testids
- `topbar-menu`, `topbar-menu:item-{id}`, `topbar-menu:more`, `topbar-menu:more-item-{id}`
- `topbar-general`, `topbar-general:logo`, `topbar-general:menu`, `topbar-general:btn-search`, `topbar-general:btn-cart`, `topbar-general:btn-hamburger`, `topbar-general:sheet`

Example
```tsx
<TopBarGeneral
  logo={<img src="/brand/logo.svg" alt="Logo" className="h-8" />}
  menuItems={[
    { id: 'home', label: 'Inicio', href: '/' },
    { id: 'cat1', label: 'Categoría 1' },
    { id: 'cat2', label: 'Categoría 2' },
  ]}
  activeId="home"
  onClickSearch={() => {}}
  onClickCart={() => {}}
/>
```

