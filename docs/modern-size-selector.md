# ModernSizeSelector

Selector de talla en formato pills, con navegación por teclado y estados visuales consistentes con los tokens del proyecto.

## Uso básico

```tsx
import ModernSizeSelector from "@/components/ui/modern-size-selector";

<ModernSizeSelector
  options={[
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
    { id: "xxl", label: "XXL", disabled: true },
  ]}
  defaultValue="m"
/>;
```

## Controlado

```tsx
const [size, setSize] = useState("l");
<ModernSizeSelector
  value={size}
  onChange={setSize}
  options={[{ id: "s", label: "S" }, { id: "m", label: "M" }]}
  ariaLabel="Selecciona tu talla"
/>;
```

<!-- Variante única por defecto (sin props de variante) -->
