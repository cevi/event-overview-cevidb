import { test, expect } from '@playwright/test';

// See event-list.spec.ts for a description of the fixture dataset (14 rows).

test.describe('filtering', () => {
  test('preset chip narrows the table to matching courses', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(
      '1 – 10 von 14'
    );

    await page.getByText('J+S-Leiter/-in werden', { exact: true }).click();

    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(
      '1 – 2 von 2'
    );
    await expect(
      page.getByRole('cell', { name: 'Gruppenleiterkurs GLK 2030' }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('cell', { name: 'European YWCA General Assembly 2030' })
    ).toHaveCount(0);
  });

  test('filter modal narrows by organisation; reset restores all events', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(
      '1 – 10 von 14'
    );

    await page.getByRole('button', { name: 'Weitere Filter' }).click();
    const dialog = page.getByRole('dialog');
    await dialog
      .locator('.filter-modal__row')
      .filter({ hasText: 'Organisation' })
      .locator('mat-select')
      .click();
    await page
      .getByRole('option', { name: 'Fachgruppen', exact: true })
      .click();
    await page.keyboard.press('Escape');
    await dialog.getByRole('button', { name: 'Schliessen' }).click();

    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(
      '1 – 1 von 1'
    );
    await expect(
      page.getByRole('cell', { name: 'European YWCA General Assembly 2030' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Filter zurücksetzen' }).click();

    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(
      '1 – 10 von 14'
    );
  });
});
