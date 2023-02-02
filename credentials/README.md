# Credentials Folder

## The purpose of this folder is to store all credentials needed to log into your server and databases. This is important for many reasons. But the two most important reasons is
    1. Grading , servers and databases will be logged into to check code and functionality of application. Not changes will be unless directed and coordinated with the team.
    2. Help. If a class TA or class CTO needs to help a team with an issue, this folder will help facilitate this giving the TA or CTO all needed info AND instructions for logging into your team's server. 


# Below is a list of items required. Missing items will causes points to be deducted from multiple milestone submissions.

1. Server URL or IP = { http://ec2-44-205-80-79.compute-1.amazonaws.com/ } 
2. SSH username = ubuntu 
<br>Command to SSH into the remote server { ssh -i "team3.pem" ubuntu@ec2-44-205-80-79.compute-1.amazonaws.com }
4. SSH password or key. = Key is the team3.pem file provided <br>
    
4. Database URL or IP and port used. = production-db.c5zxj2uma5mb.us-east-1.rds.amazonaws.com , port = 3306
    <br><strong> NOTE THIS DOES NOT MEAN YOUR DATABASE NEEDS A PUBLIC FACING PORT.</strong> But knowing the IP and port number will help with SSH tunneling into the database. The default port is more than sufficient for this class.
5. Database username = production
6. Database password = password
7. Database name (basically the name that contains all your tables) = team3_db and test_db
8. Instructions on how to use the above information. <br>
Once downloading the ssh (team3.pem) key to your machine, you must use the command ( chmod 400 team3.pem ) to set the correct permissions of the file. 
After that, you can use the command ( ssh -i "team3.pem" ubuntu@ec2-44-205-80-79.compute-1.amazonaws.com ) to connect to the remote server. After connecting to the remote server, there is a folder ( csc648-03-sp22-team03 ) which will contain the application folder which you will cd into it. Once in the application folder, you can run the command ( node app.js ) to run the web application. After you can visit the url ( http://ec2-44-205-80-79.compute-1.amazonaws.com/ ) where the page should be loaded. <br>
To connect to the database, we used MySql workbench added a new connection with the method Standard TCP/IP over SSH. From there we use the information above to connect to the database. <br>
# Most important things to Remember
## These values need to kept update to date throughout the semester. <br>
## <strong>Failure to do so will result it points be deducted from milestone submissions.</strong><br>
## You may store the most of the above in this README.md file. DO NOT Store the SSH key or any keys in this README.md file.
