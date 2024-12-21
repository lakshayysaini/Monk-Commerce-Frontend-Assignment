# Monk Commerce Frontend Assignment

This app is basically a UI to add products and their specific variants in a list. When you click on edit icon then a dialog box wil open in which there is an API call to fetch the products and variants.

There is also scroll pagination like only ten results would fetch at first and then if you scroll more and more then more and more results would get fetched.

Then after we'll just rendering all the selected products and their respective variants.
  
https://monk-commerce-frontend-assignment.netlify.app/

## Implementation
1) There are only 3 components used in this - DraggableItem.tsx , ProductPicker.tsx and SelectedProduct.tsx.
2) The simplest is the draggable component in the DraggableItem.tsx which is basically a reusable component we are using to drag the products as well as variants.
3) Other is the ProductPicker component which is a dialog box in which we are fetching the products through API and we using IntersectionObserver browser API to take care of the observer ref and when we scroll to the bottom of the box then again API call takes place as we have it in the useEffect and dependecies are adjusted accordingly.
4) The selected products from the ProductPicker component gets populated in the 3rd component which renders them in the main UI.

Thank you for this Assignment :)
