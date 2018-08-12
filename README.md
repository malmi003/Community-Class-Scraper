# Community Class Scraper

This app was designed to use a variety of technologies (Mongo, mongoose, express, axios, cheerios, etc.) to scrape the Minneapolis Public Schools Community Education website for the latest classes. After displaying each option, this app allows the user to save favorite classes and add notes for reference later.

## How it works
Select the "Check for new class offerings" to get the current class category listing. This button scrapes the main menu on the MPS Community Education website and saves each category to the database and displays each one on the page with their own respective "scrape" button. 
![Image1](/public/images/img1.png) 
######
Selecting an individual class scrape btn will then scrape the MPS website again following the link grabbed from the first scrape and each class offering in that category will also be displayed. An association is made in the database between each class and its category.
######
![Image3](/public/images/img3.png)
######
Switching over to the "View saved classes" page, you can view the basic class information from previously saved classes. 
######
![Image4](/public/images/img4.png)
######
Here you can add notes about each one which will automatically be displayed or your can hide them with the "hide/show button"
######
![Image5](/public/images/img5.png)
######
Clicking "add note" will open up a form modal and will make an association between the note and the respective class in the database allowing it to be displayed in the correct location on the page.
######
![Image6](/public/images/img6.png)
######
Finally you can delete notes that are no longer relevant by selecting the delete btn.
######
![Image7](/public/images/img7.png)

## Further development ideas:
- allow users to drop favorite classes from the "View Saved Classes" page
- allow users to update classes
- save/display more information about each classes such as cost, start dates, etc.
- add more styling like pictures and a more uniform color scheme

View the deployed webpage here: [Community Ed Scraper](https://morning-springs-85911.herokuapp.com/)