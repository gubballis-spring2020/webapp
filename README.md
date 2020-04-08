# webapp

# Assignment-3
## Pre-requisites
1) The application uses node and mysql, so to test the application locally both node and mysql should be configured. If you are using MYSQL version 8 , then you ned to configure the root password authentication to be able to make it work with node.

    ```
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourrootpass';
    ```

2) The users and bills table need to be created in the database CSYE6225 and it is availabe in the sql folder.

3) Change the root password for MYSQL server in the db.config.js folder.

## Test and Build
1) cd to webapp folder and run npm install to install the necessary packages required to run the app.

2) The webapp uses jest framework for testing and run npm test for the test cases in the server.test.js file.

3) After each tests if you want to test it again, please make sure that the data in the tables is cleaned otherwise the tests will throw an error for few since it does not allow duplicate users creation.

4) To run circleci jobs locally, download the circleci binary brew install or sudo snap install and you can execute the below command

    ```circleci local execute --job pr_check``` .

5) This application uses a SSL certificate which have to be acuired from where the domain is registered.