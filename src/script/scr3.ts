// import axios from 'axios';
// import cheerio, { Cheerio, Element } from 'cheerio';

// interface Recipe {
//   title: string;
//   ingredients: string[];
//   steps: string[];
// }

// export async function scrapeCuisineActuelle(url: string): Promise<Recipe> {
//   const { data: html } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } });
//   const $ = cheerio.load(html);

//   const title = $('h1').text().trim();
//   const ingredients = $('.recipeIngredients-list.recipeIngredients-noSplitter > li');
//   const stepsContents = $('.recipe-instructionContent > ol > li');

//   const ingredientsList: string[] = [];
//   const stepsList: string[] = [];

//   ingredients.each((_index: number, element: Element) => {
//     ingredientsList.push($(element).text());
//   });

//   stepsContents.each((index: number, element: Element) => {
//     stepsList.push(`Étape ${index + 1}: ${$(element).text()}`);
//   });

//   return {
//     title: title,
//     ingredients: ingredientsList,
//     steps: stepsList,
//   };
// }

// const testUrl = 'https://www.cuisineactuelle.fr/recettes/gateau-nature-sans-aeuf-196846';

// scrapeCuisineActuelle(testUrl)
//   .then(recipe => console.log(recipe))
//   .catch(err => console.error(err));
