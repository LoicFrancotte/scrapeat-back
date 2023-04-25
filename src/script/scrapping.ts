import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  const page = await browser.newPage();

  await page.goto('https://www.marmiton.org/recettes/recette_gateau-au-yaourt-et-pepites-de-chocolat-nestle-dessert_534481.aspx');

  await page.click('#didomi-notice-agree-button')

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
      stepsList.push({
        stepName: `Étape ${index + 1}`,
        stepContent: stepContent.textContent
      });
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

  console.log(`${recipe.title}\n\nIngrédients:`);
  recipe.ingredients.forEach(ingredient => {
    console.log(ingredient);
  });

  console.log('\nUstensiles:');
  recipe.ustensiles.forEach(ustensile => {
    console.log(ustensile);
  });

  console.log('\n');
  recipe.steps.forEach(step => {
    console.log(`${step.stepName}\n${step.stepContent}\n`);
  });

})();