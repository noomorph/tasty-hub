/* global module */

module.exports = {
  steps: [
    {
      mediaItems: [{ src: 'img/ingredients.jpg'}],
      header: 'Prepare ingredients',
      description:
        '2 large or 3 medium beets, thoroughly washed. \n' + 
        '2 large or 3 medium potatoes, sliced into bite-sized pieces.\n' +
        '4 Tbsp of cooking oil. \n' +
        '1 medium onion, finely chopped. \n' +
        '2 carrots, grated \n' +
        '1/2 head of cabbage, thinly chopped (see picture) \n' +
        '1 can kidney beans with their juice \n' +
        '2 bay leaves \n' +
        '16 cup of water \n' +
        '5 Tbsp ketchup \n' +
        '4 Tbsp lemon juice \n' +
        '1/4 tsp freshly ground pepper \n' +
        '1 Tbsp dill'
    },
    {
      mediaItems: [{ src: 'img/1.jpg'}],
      header: 'Boiling beets',
      description:
        'Fill a large soup pot with 10 cups of water.\n' +
        'Add 2 – 3 beets. Cover and boil for about 1 hour \n' +
        '(some beats take longer, some take less time. \n' +
        'It depends on how old the beets are). \n' +
        'Once you can smoothly pierce the beets \n' +
        'with a butter knife, remove from the water \n' +
        'and set aside to cool. Keep the water.'
    },
    {
      mediaItems: [{ src: 'img/2.1.jpg'}],
      header: 'Boiling broth',
      duration: 15,
      description: 'Continue boiling broth on the middle fire.',
      depends: [1]
    },
    {
      mediaItems: [{ src: 'img/3.jpg'}],
      header: 'Slicing potatoes',
      description: 'Slice 3 potatoes.'
    },
    {
      mediaItems: [{ src: 'img/4.jpg'}],
      header: 'Adding and boiling potatoes',
      description: 'Add potatoes into the same water and boil 15-20 minutes.'
    },
    {
      mediaItems: [{ src: 'img/5.jpg'}],
      header: 'Grating carrots and dicing onion',
      description: 'Grate both carrots and dice one onion.'
    },
    {
      mediaItems: [{ src: 'img/6.1.jpg'}],
      header: 'Roasting',
      description: 
        'Take carrots and onion. \n' +
        'Add 4 Tbsp of cooking oil \n' +
        'to the skillet and saute vegetables \n' +
        'until they are soft. \n' +
        'Stir in ketchup when they are \n' +
        'almost done cooking. '
    },
    {
      mediaItems: [{ src: 'img/7.jpg'}],
      header: 'Shredding cabbage ',
      description: 'Thinly shred 1/2 a cabbage.'
    },
    {
      mediaItems: [{ src: 'img/8.jpg'}],
      header: 'Adding cabbage and boiling',
      description:
        'Add cabbage to the pot\n' +
        'when potatoes are half way done\n' +
        'and boil 7-10min.'
    },
    {
      mediaItems: [{ src: 'img/9.jpg'}],
      header: 'Pealing and slicing beets',
      description:
        'Next, peel and slice the beets' +
        'into match sticks.'
    },
    {
      mediaItems: [{ src: 'img/10.jpg'}],
      header: 'Adding ingredients and finish',
      description:
        'Add 6 cups of water, beets, lemon juice, ' +
        'pepper, bay leaves and can of kidney beans ' +
        '(with their juice). Also add sauted carrots ' +
        'and onion to the pot along with chopped dill. ' +
        'Cook 5-10 minutes, until the cabbage is done.'
    },
    {
      mediaItems: [{ src: 'img/10.1.jpg'}],
      header: 'Adding ingredients and finish',
      description:
        'Add 6 cups of water, beets, lemon juice, ' +
        'pepper, bay leaves and can of kidney beans ' +
        '(with their juice). Also add sauted carrots ' +
        'and onion to the pot along with chopped dill. ' +
        'Cook 5-10 minutes, until the cabbage is done.'
    },
    {
      mediaItems: [{ src: 'img/main.jpg'}],
      header: 'Serving',
      description:
        'Please serve the borsch with a dollop of sour ' +
        'cream or real mayo. Wish you bon appetite and ' +
        'enjoy the GREAT TASTE you did yourself! \n' +
        'P.S. Keep TastyHub in secret and you \n' +
        'will be appreciated as a chef.'
    }
  ]
};
