API End points
POST /cartItems - 
The user must send the product name so the api can search for the product
id of the given product name. then it will store the id of the product
that you searched for into the ProductId that will have a ref from
the Product collection.  This api endpoint will add items to the cart.

GET /cartItems - 
This will get all the items from the cart. look at the second router handler
from the task router for the syntax.

DELETE /cartItems/:id -
just like this above route handler function. but instead we remove that product
instead of modifying the quantity in the cartitem collection.

//the above route handler/api endpoint is done and complete.


Now it's time to create the admin route
- 





api endpoint to fix later
PATCH /cartItems/:id -
This will allow the client to modify the quanity of an item in the cart.
I will have to create a middleware that always passes all the cartItems for the user shoppingCart
then we can use a instance method for the shoppingCart model
the client has to provide the cart id and product id. to get the product Id we can retrieve the product
name and do a search in the backend to find the product id. then we can
modify the quantity of the product in the backend.




Notes:
- mongoose.objectId type when defining the schema for the model means it
will be auto generated if not provided.
- I will create a rule in my api where if they want to use my api they
have to sign up. I will assign them a id for the cartTypeId with there
ecommerce site name on the database. Then on there frontend all they have
to do is have that id set as cartTypeId and make the field hidden and
send it to the api and we do the rest.
- to start mongodb type
/users/ujust/mongodb/bin/mongod.exe –dbpath=/Users/ujust/mongodb-data 
- the naming conventions for routes are correct. the route name should be based
off of the model name. same I am talking about the paths as well for each route
handler. What you do need is a documentation for your api so people know which
route path gives you what data back. Then you can display the data of the json
object in the front end.



to do list:
- fix the view cart api end point because we can't display the quantity with the product name
because they are two separate tables.
- adding a cartItem api end point is not working
- create the routes for the product model
- create the routes for the category model
- create the documentation for your api
- create an instance method for the shoppingCart model or a model custom method for it
to be able to get the cartItem with the product names or something like that. Make the
middleware getCartItems more organized. 

Where I left off
- trying to add the name for each cartItem. the cartItem table has a quantity field.
