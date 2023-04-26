import puppeteer from 'puppeteer';

export async function scrapeMarmiton(url) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(url);
  await page.click('#didomi-notice-agree-button');

  const recipe = await page.evaluate(() => {
    const title = document.querySelector('.SHRD__sc-10plygc-0.itJBWW');
    const ingredients = document.querySelectorAll('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-3.MuiGrid-grid-sm-3');
    const stepsContents = document.querySelectorAll('.RCP__sc-1wtzf9a-3.bFBrMO');
    const ustensiles = document.querySelectorAll('.RCP__sc-1641h7i-3.iLcXC');

    const ingredientsList = [];
    const stepsList = [];
    const ustensilesList = [];

    ingredients.forEach(ingredient => {
      ingredientsList.push(ingredient.textContent);
    });

    stepsContents.forEach((stepContent, index) => {
      stepsList.push(`Étape ${index + 1}: ${stepContent.textContent}`);
    });

    ustensiles.forEach(ustensile => {
      ustensilesList.push(ustensile.textContent);
    });

    return {
      title: title.textContent,
      ingredients: ingredientsList,
      steps: stepsList,
      ustensiles: ustensilesList
    };
  });

  await browser.close();
  return recipe;
}