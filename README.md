# Do Knob Disturb A tangible Controller for a Distraction free Work Environment
This repository contains all artifacts and code components for the paper "Do Knob Disturb: A tangible Controller for a Distraction-free Work Environment" by Felix Riedl, Julia Sageder and Prof. Dr. Niels Henze.

Software is provided "as is". Use at your own risk.

Within this repository, we have compiled all components, that are important for replicating our study setup. Also, we provide a short description on how to deploy the components of the setup:

## Knob Client

### Prerequisites
* Current version of node and npm (get both at https://www.npmjs.com/get-npm and https://www.npmjs.com/get-npm)
* Current version of foreverjs (install via "npm install foreverjs")
* Windows (7+) Computer

### Installation 
* In the project folder, execute "npm install"
* In console, run "npm install foreverjs"

### Temporarily Start client
* In the project folder "Client_Software", execute "node main.js". This will temporarily start the client.

### Start Client on Autostart
To restart the client on system start, a bat script needs to be modified and executed on user login:
* In the bat folder, open startup.bat
* Replace the line "cd C:\Users\Felix\Documents\aue_ss19_do_knob_disturb\Client_Software" with "cd ABSOLUTE_PATH_TO_YOUR_CLIENT_FOLDER"
* Save the file
* Press Windows + R, enter "shell:startup" and copy the .bat file into the opened startup folder
* Restart the PC and log in. Validate, whether the command "forever list" shows running services

### Stop Client
* Open console and enter "forever stopall"
* If you registered the service in autostart, press Windows + R, enter "shell:startup" and remove the batch file

### Access Files
* Open the "Client_Software" folder, the logs will be stored in a .csv labelled with the date of recording

### Warning
The Client is started as background service and logs mouse and keyboard interactions.


## Chrome Extension

### Prerequisites
* A current version of the Chrome Browser
* A windows (7+) computer

### Installation
* Open your Chrome Browser
* In the URL field, enter chrome://extensions
* Activate "Developer Mode" in the right upper corner
* Press "Load unzipped extension" and select the folder "Plugin"
* Restart your Chrome Browser 

### Configuration
* In the folder "Plugin", open the file "content.js"
* In the first lines, add the desired sites to the black- and graylist arrays
* Remove the plugin from your browser
* Execute the steps below "Installation" once more to update your changes

## Knob Controller

### Prerequisites
* A knob artifact
* A windows (7+) computer
* Current CH341SER Drivers http://www.wch.cn/download/CH341SER_ZIP.html

### Installation
* Plug the artifact in, after the knob client has been started.

## Phone Blocker

### Prerequisites
* An Android smartphone
* A google account created for the participant

### Installation
* Install the IFTTT App on the android smartphone
* Log in with the google account created for the participant 
* Setup three recipes with the desired android events. 
* As trigger, use hooks with the following format: urknob_prio_<1,2,3>_dev<ParticipantID>
* Prio describes the hook state, which triggers the action
* Under Client_Software, open main.js
* Set the variable "pid" to ParticipantID chosen in the triggers
* Get the webhook key for your ifttt account (if logged in, you can find it by clicking "Documentation" at https://ifttt.com/maker_webhooks)
* Open ifttt.client.js and replace the variable DEV_KEY with your key
* Restart the device client
  
  
## Compile and flash firmware

### Prerequisites
* Current CH341SER Drivers http://www.wch.cn/download/CH341SER_ZIP.html
* Arduino IDE with correct Board Description of  WemosD1 mini
* Windows Computer

### Installation
* Open the Knob_Firmware Project in the Arduino IDE
* Connect knob or knob circut to USB Port
* Select COM Port of device
* Compile and transfer the program 
