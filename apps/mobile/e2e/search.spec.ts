import { test, expect } from '@playwright/test';

test('Search Screen shows results for "Barba"', async ({ page }) => {
  // Acessa o app
  await page.goto('http://localhost:8081');

  // Preenche o campo de busca
  const searchInput = page.getByPlaceholder('Buscar');
  await expect(searchInput).toBeVisible();
  
  await searchInput.fill('Barba');
  
  // Aciona a busca simulando um Enter no teclado (isso invoca onSubmitEditing)
  await searchInput.press('Enter');

  // Verifica se fomos para a SearchScreen conferindo o subtítulo esperado
  const resultsSubtitle = page.getByText('RESULTADOS PARA "BARBA"');
  await expect(resultsSubtitle).toBeVisible({ timeout: 10000 });

  // Opcional: Se quisermos validar a presença de algum item do resultado
  // Sabemos que não haverá Nenhuma barbearia se 'Barba' for buscado (se o mock/banco tiver).
  // Se o banco estiver vazio para 'Barba', garantimos que não houve crash.
});
