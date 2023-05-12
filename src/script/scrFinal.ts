import axios from 'axios';
import cheerio, { Cheerio, Element } from 'cheerio';
import { CheerioAPI } from 'cheerio';

interface Recipe {
  title: string;
  ingredients: string[];
  ustensiles?: string[];
  steps: string[];
}

async function scrapeMarmiton($: CheerioAPI): Promise<Recipe> {
  const title = $('.SHRD__sc-10plygc-0.itJBWW').text();
  const ingredients = $('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-3.MuiGrid-grid-sm-3');
  const stepsContents = $('.RCP__sc-1wtzf9a-3.bFBrMO');
  const ustensiles = $('.RCP__sc-1641h7i-3.iLcXC');

  const ingredientsList: string[] = [];
  const stepsList: string[] = [];
  const ustensilesList: string[] = [];

  ingredients.each((_index: number, element: Element) => {
    ingredientsList.push($(element).text());
  });

  stepsContents.each((index: number, element: Element) => {
    stepsList.push(`Étape ${index + 1}: ${$(element).text()}`);
  });

  ustensiles.each((_index: number, element: Element) => {
    ustensilesList.push($(element).text());
  });

  return {
    title: title,
    ingredients: ingredientsList,
    ustensiles: ustensilesList,
    steps: stepsList,
  };
}

async function scrapeCuisineAZ($: CheerioAPI): Promise<Recipe> {
  const title = $('.recipe-title').text();
  const ingredientsElements = $('.borderSection.ingredients ul li');
  const stepsContents = $('li > p > span');

  const ingredientsList: string[] = [];
  const stepsList: string[] = [];

  ingredientsElements.each((_index: number, element: Element) => {
    const ingredientSpans = $(element).find('span');
    let ingredient = $(ingredientSpans[0]).text().trim();
    if (ingredientSpans.length > 1) {
      ingredient += ` ${$(ingredientSpans[1]).text().trim()}`;
    }
    ingredientsList.push(ingredient);
  });

  stepsContents.each((index: number, element: Element) => {
    stepsList.push(`Étape ${index + 1}: ${$(element).text().trim()}`);
  });

  return {
    title: title,
    ingredients: ingredientsList,
    ustensiles: [],
    steps: stepsList
  };
}

export async function scrapeCuisineActuelle($: CheerioAPI): Promise<Recipe> {
  const title = $('h1').text().trim();
  const ingredients = $('.recipeIngredients-list.recipeIngredients-noSplitter > .recipeIngredients-ingredient');
  const stepsContents = $('.recipe-instructionContent > ol > li');

  const ingredientsSet: Set<string> = new Set();
  const stepsList: string[] = [];

  ingredients.each((_index: number, element: Element) => {
    const ingredient = $(element).text().replace(/\n/g, '').trim();
    ingredientsSet.add(ingredient);
  });

  stepsContents.each((index: number, element: Element) => {
    stepsList.push(`Étape ${index + 1}: ${$(element).text()}`);
  });

  const ingredientsList: string[] = Array.from(ingredientsSet);

  return {
    title: title,
    ingredients: ingredientsList,
    ustensiles: [],
    steps: stepsList
  };
}

export async function scrapeRecipe(url: string): Promise<Recipe> {
  const { data: html } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } });
  const $ = cheerio.load(html);

  if (url.includes('marmiton.org')) {
    return scrapeMarmiton($);
  } else if (url.includes('cuisineaz.com')) {
    return scrapeCuisineAZ($);
  } else if (url.includes('cuisineactuelle.fr')) {
    return scrapeCuisineActuelle($);
  } else {
    throw new Error('URL not recognized. Only Marmiton and CuisineAZ URLs are accepted.');
  }
}

// const testUrlMarmiton = 'https://www.marmiton.org/recettes/recette_rougail-saucisse_12916.aspx';
// const testUrlCuisineAZ = 'https://www.cuisineaz.com/recettes/rougail-saucisse-au-cookeo-98246.aspx';
// const testUrlCuisineActuelle = 'https://www.cuisineactuelle.fr/recettes/gateau-nature-sans-aeuf-196846';

// scrapeRecipe(testUrlMarmiton)
//   .then(recipe => console.log(recipe))
//   .catch(err => console.error(err));

// scrapeRecipe(testUrlCuisineAZ)
//   .then(recipe => console.log(recipe))
//   .catch(err => console.error(err));

// scrapeRecipe(testUrlCuisineActuelle)
//   .then(recipe => console.log(recipe))
//   .catch(err => console.error(err));