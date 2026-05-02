feat(frontend): implement filter modal (#234)

Move all filters into a dedicated modal dialog opened via a new "Weitere Filter" button. The preset chips remain in the main view. A MatBadge on the button shows the number of active filters. Every filter change in the modal is applied immediately. The "Filter zurücksetzen" button stays in the main toolbar next to the new button.
