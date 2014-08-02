'use strict';

var simple = {
  navigate: function () {
    return browser.get('/simple');
  },
  favorite: element(by.name('favorite')),
  submit: element(by.buttonText('Submit')),
  messages: element(by.id('messages'))
};

describe('Simple Form', function () {
  simple.navigate();

  it('shows error when you submit empty favorite', function () {
    simple.favorite.clear();
    simple.submit.click();
    expect(simple.messages.getText()).toEqual('cannot be empty');
  });

  it('shows saved message when you input a value', function () {
    simple.favorite.clear();
    simple.favorite.sendKeys('banana');
    simple.submit.click();
    expect(simple.messages.getText()).toEqual('Saved!');
  });

});
