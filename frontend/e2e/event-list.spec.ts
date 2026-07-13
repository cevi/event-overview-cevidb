import { test, expect } from '@playwright/test';

// These specs run against the backend's fake-Hitobito mode
// (see tooling/compose.e2e.yml), which serves the fixtures under
// backend/src/main/resources/fake_data/. With the event/course group
// whitelist used for e2e, exactly 14 rows are returned:
// - 1x "European YWCA General Assembly 2030" (event)
// - 11x "Cevi News-Versand" occurrences (event)
// - 2x "Gruppenleiterkurs GLK 2030" occurrences (course)
// These counts mirror backend/src/test/java/.../EventControllerTests.java.

test.describe('event list', () => {
  test('renders the fixture events, paginated', async ({ page }) => {
    await page.goto('/');

    // page 1 (rows 1-10, sorted ascending by start date as returned by the
    // backend): both the YWCA event (18.05.2030) and the two GLK course
    // occurrences (04.03./08.04.2030) fall within the first 10 rows.
    await expect(
      page.getByRole('cell', { name: 'European YWCA General Assembly 2030' })
    ).toBeVisible();
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(
      '1 – 10 von 14'
    );
    await expect(
      page.getByRole('cell', { name: 'Gruppenleiterkurs GLK 2030' }).first()
    ).toBeVisible();

    await page.getByRole('button', { name: 'Nächste Seite' }).click();

    // page 2 (rows 11-14) only contains the remaining "Cevi News-Versand"
    // occurrences (Sep-Dec 2030).
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(
      '11 – 14 von 14'
    );
    await expect(
      page.getByRole('cell', { name: 'Cevi News-Versand' }).first()
    ).toBeVisible();
  });

  test('sorting by start date toggles ascending/descending order', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(
      '1 – 10 von 14'
    );

    // show all 14 rows on one page so reversing the array is meaningful
    // (force: the paginator's larger touch-target overlay intercepts the
    // pointer event otherwise)
    await page.getByRole('combobox').click({ force: true });
    await page.getByRole('option', { name: '20', exact: true }).click();
    await expect(page.locator('.mat-mdc-paginator-range-label')).toHaveText(
      '1 – 14 von 14'
    );

    const dateCells = page.locator('td.mat-column-startsAt');

    await page.getByRole('button', { name: 'Startdatum' }).click();
    const firstClick = await dateCells.allTextContents();

    await page.getByRole('button', { name: 'Startdatum' }).click();
    const secondClick = await dateCells.allTextContents();

    expect(firstClick).toHaveLength(14);
    expect(secondClick).toEqual([...firstClick].reverse());
    expect(secondClick).not.toEqual(firstClick);
  });

  test('cevi.db link points at the applicationLink from the fixture', async ({
    page,
  }) => {
    await page.goto('/');

    const row = page.getByRole('row', {
      name: /European YWCA General Assembly 2030/,
    });
    const link = row.getByRole('link', { name: 'Öffnen' });

    await expect(link).toHaveAttribute(
      'href',
      'https://db.cevi.ch/groups/1971/public_events/3213'
    );
    await expect(link).toHaveAttribute('target', '_blank');
  });
});
