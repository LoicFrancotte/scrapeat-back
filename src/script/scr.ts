import axios from 'axios';
import cheerio, { Cheerio, Element } from 'cheerio';

interface Recipe {
  title: string;
  ingredients: string[];
  ustensiles: string[];
  steps: string[];
}

export async function scrapeMarmiton(url: string): Promise<Recipe> {
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

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
