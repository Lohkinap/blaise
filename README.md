# Blaise
Site web pour [blaise-cli](https://github.com/Lohkinap/blaise-cli), un outil CLI de prise de notes Markdown, réalisé par **Frédérick Lemieux** dans le cadre du cours _Intégration des interfaces web II (582-D64-RI)_ au Cégep de Trois-Rivières.

## Dépôt et accès
- **Code source :** Disponible sur le [dépôt GitHub](https://github.com/Lohkinap/blaise).
- **En ligne :** Accessible via [GitHub Pages](https://lohkinap.github.io/blaise).
- **Clone :** `git@github.com:Lohkinap/blaise.git`

## Utilisation
```bash
git clone https://github.com/Lohkinap/blaise.git
cd blaise
npx serve .
```

## Requis
### Composants Tailwind
Les composants utilisés dans le projet proviennent de BasecoatUI.
- [Button](https://basecoatui.com/components/button) [[Default](https://basecoatui.com/components/button/#default), [Outline](https://basecoatui.com/components/button/#outline), [Ghost](https://basecoatui.com/components/button/#ghost), [Link](https://basecoatui.com/components/button/#link)]
- [Button Group](https://basecoatui.com/components/button-group)
- [Card](https://basecoatui.com/components/card)
- [Checkbox](https://basecoatui.com/components/checkbox)
- [Dialog](https://basecoatui.com/components/dialog)
- [Drawer](https://basecoatui.com/components/drawer)
- [Radio Group](https://basecoatui.com/components/radio-group) [[Choice Card](https://basecoatui.com/components/radio-group/#choice-card)]
- [Select](https://basecoatui.com/components/select)
- [Sidebar](https://basecoatui.com/components/sidebar)
- [Tabs](https://basecoatui.com/components/tabs)
- [Tooltip](https://basecoatui.com/components/tooltip)

### Animation
Les animations du projet ont été réalisées par moi.
- Flicker — Animation de scintillement sur le titre de la page [`./404.html`](./404.html), _javascript_.
- Gradient — Bas de la page [`./index.html`](./index.html) avec défilement dynamique, _css_ + _javascript_.
- Ribbon — Conteneur défilant infini avec effet de pause au survol et masques de fondu, _css_ + _javascript_.

## Screenshots
- **index**: [desktop](screenshots/desktop-1920.index.webp) | [mobile](screenshots/mobile-500.index.webp)
- **docs**: [desktop](screenshots/desktop-1920.docs.webp) | [mobile](screenshots/mobile-500.docs.webp)
- **reference**: [desktop](screenshots/desktop-1920.reference.webp) | [mobile](screenshots/mobile-500.reference.webp)
- **pricing**: [desktop](screenshots/desktop-1920.pricing.webp) | [mobile](screenshots/mobile-500.pricing.webp)
- **signup**: [desktop](screenshots/desktop-1920.signup.webp) | [mobile](screenshots/mobile-500.signup.webp)
- **signin**: [desktop](screenshots/desktop-1920.signin.webp) | [mobile](screenshots/mobile-500.signin.webp)