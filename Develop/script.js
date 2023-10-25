//Defined Values For Password Strings
const lowercaseString = "abcdefghijklmnopqrstuvwxyz";
const uppercaseString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbersString = "0123456789";
const symbolsString = "`~!@#$%^&*_+=";

const passwordMinLength = 8;

//Limit Length Textbox To Only Numbers
function isNumber(evt) {
  evt = evt ? evt : window.event;
  let charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

//Get Generate Button And Add OnClick Handler To Write Password
const generateBtn = document.querySelector("#generate");
function writePassword() {
  const password = generatePassword();
  const passwordText = document.querySelector("#password");

  passwordText.value = password;
}
generateBtn.addEventListener("click", writePassword);

//Get All New Control Elements I Added
//Checkbox for use custom character array
const useCustomArrayCheckBox = document.getElementById(
  "useCustomCharacterArray"
);
//"Textbox" (Span) for custom character array
const customCharacterArrayTextBox = document.getElementById(
  "customCharacterArrayInput"
);
//NOTE - Label
const customCharactersLabel = document.getElementById(
  "customCharacterArrayNoteLabel"
);

//Get the Options Checkboxes
const lowercaseCheckbox = document.getElementById("useLowercase");
const uppercaseCheckbox = document.getElementById("useUppercase");
const numbersCheckbox = document.getElementById("useNumbers");
const symbolsCheckbox = document.getElementById("useSymbols");

//Finally the Options Controls Wrapper To Disable It When Password Controls Is Checked
const passwordControlsWrapper = document.getElementById("passwordControls");

//This is messy because of the different naming conventions/classes added to each, basically this logic just shows the custom character array
//input textbox when the checkbox for use custom characters is checked as well as hide the default checkboxes above
document.addEventListener("click", () => {
  if (useCustomArrayCheckBox.checked) {
    customCharactersLabel.classList.remove("hidden");
    passwordControlsWrapper.classList.add("disabled");
    customCharacterArrayTextBox.classList.add("active");
  } else {
    customCharactersLabel.classList.add("hidden");
    passwordControlsWrapper.classList.remove("disabled");
    customCharacterArrayTextBox.classList.remove("active");
  }
});

//Finally The Generate Password Function
function generatePassword() {
  //Get Length Of Password From Input Box
  const passwordLength = document.getElementById("passwordLengthInput").value;
  //Run Some Error Checks
  if (!passwordLength || passwordLength == 0) {
    return "Password Length Cannot Be 0";
  }

  if (Number(passwordLength) < passwordMinLength) {
    return `Password Is Too Short, Minimum Length Is ${passwordMinLength} Characters`;
  }

  //Declare Character Array To Be Used Later
  let characterArray = [];

  if (useCustomArrayCheckBox.checked) {
    //If Using Custom Array
    //Check Custom Array Has Characters
    if (!customCharacterArrayTextBox.innerHTML) {
      return "Custom Array Empty, Please Enter Characters Into Text Entry To Use Custom Characters!";
    }

    //Loop Through Each Element In Custom Character String, This Has To Be .innerHTML and not .value
    //because this textbox isn't actually a textbox, it's a span for the resizing property
    for (let i = 0; i < customCharacterArrayTextBox.innerHTML.length; i++) {
      characterArray.push(customCharacterArrayTextBox.innerHTML[i]);
    }

    //Call And Return Random Hash Function With Custom Character Array And Length Defined In passwordLength Cast To Number()
    return randomHash(characterArray, Number(passwordLength));
  } else {
    //If Not Using Custom Array
    //Run Error Checking To Make Sure Some Option Was Selected
    if (
      !lowercaseCheckbox.checked &&
      !uppercaseCheckbox.checked &&
      !numbersCheckbox.checked &&
      !symbolsCheckbox.checked
    ) {
      return "Please Select Options For Password";
    }

    //Very Simular Thing To The Custom Character Array Parsing, Only Instead Of Getting The Content From An Input/
    //(customCharacterArrayTextBox.innerHTML), These strings were defined in lines 1-4 So We Can Just Loop Through Them Directly
    let characterArray = [];

    //If Lowercase Checked Add Lowercase String To Character Array
    if (lowercaseCheckbox.checked) {
      for (let i = 0; i < lowercaseString.length; i++) {
        characterArray.push(lowercaseString[i]);
      }
    }

    //If Uppercase Checked Add Uppercase String To Character Array
    if (uppercaseCheckbox.checked) {
      for (let i = 0; i < uppercaseString.length; i++) {
        characterArray.push(uppercaseString[i]);
      }
    }

    //...etc (Numbers)
    if (numbersCheckbox.checked) {
      for (let i = 0; i < numbersString.length; i++) {
        characterArray.push(numbersString[i]);
      }
    }

    //...etc (Symbols)
    if (symbolsCheckbox.checked) {
      for (let i = 0; i < symbolsString.length; i++) {
        characterArray.push(symbolsString[i]);
      }
    }

    //Finally Return The Random Hash Of This CharacterArray With Length Of Entered Password Length
    return randomHash(characterArray, Number(passwordLength));
  }
}

//Random Hashing Function
function randomHash(characterArray, length) {
  //Declare An Empty String To Add To
  let password = "";

  //Loop Through As Many Times As Length Is Defined, e.g. 7 Character Length Runs Loop 7 Times, Resulting In 7 Character Password
  for (let i = 0; i < length; i++) {
    //Calculate a random index between 0 and characterArray.length - 1 (Doesn't seem like it, but Math.floor rounds down the value and
    //Math.random returns a random decimal between 0 and 1, including 0 but not including 1, thus by multiplying it by the length of
    //the character array we can have a max value of 0.99999*length which when put through Math.floor() will result in max value of length-1)
    const randIndex = Math.floor(Math.random() * characterArray.length);

    //Add the character at index[randIndex] calculated right before, this maps the random value to some character in the array:
    //characterArray = ["a", "b", "c", "d", ...] => characterArray has indexes [0 -> characterArray.length - 1] => characterArray[randIndex => 2] = "b"
    password += characterArray[randIndex];
  }

  //Finally, return the password out of this function so it can then be read/returned back to the user.
  return password;
}
