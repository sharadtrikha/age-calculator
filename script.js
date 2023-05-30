// selectors
const submitBtn = document.querySelector(".submit-arrow-btn");
const dayInput = document.querySelector("#day");
const monthInput = document.querySelector("#month");
const yearInput = document.querySelector("#year");
const calculatedYears = document.querySelector('.calculated-years');
const calculatedMonths = document.querySelector('.calculated-months');
const calculatedDays = document.querySelector('.calculated-days');

const calculatorForm = document.querySelector("#calculator-form");


// listeners
submitBtn.addEventListener("click", submitInput);

function resetErrorState() {
  [...calculatorForm.elements].forEach((formElement) => {
    formElement.classList.remove("error-input");
    formElement.previousElementSibling.classList.remove("error");
    formElement.nextElementSibling.innerText = "";
  });
  calculatedYears.innerText = "--";
  calculatedMonths.innerText = "--";
  calculatedDays.innerText = "--";
}

function validateInputFields(input) {
  const { id, value } = input;
  const state = {
    error: false,
    msg: "",
  };
  switch (id) {
    case "day":
      const isValidDay = value >= 1 && value <= 31;
      return isValidDay ? state : { error: true, msg: "Must be a valid day" };

    case "month":
      const isValidMonth = value >= 1 && value <= 12;
      return isValidMonth
        ? state
        : { error: true, msg: "Must be a valid month" };

    case "year":
      const date = new Date();
      const year = date.getFullYear();
      const isValidYear = value.toString().length === 4;
      if (isValidYear) {
        const isPastYear = Number(value) > year;
        return isPastYear ? { error: true, msg: "Must be a past year" } : state;
      } else {
        return { error: true, msg: "Must be a valid year" };
      }
  }
}

function validateInputsFilled() {

  let isValid = true;
  [...calculatorForm.elements].forEach((formElement) => {
    if (formElement.value == "") {
      formElement.classList.add("error-input");
      formElement.previousElementSibling.classList.add("error");
      formElement.nextElementSibling.innerText = "This is a mandatory field";
      isValid = false;
    } else {
      const { error, msg } = validateInputFields(formElement);
      if (error) {
        isValid = false;
        formElement.classList.add("error-input");
        formElement.previousElementSibling.classList.add("error");
        formElement.nextElementSibling.innerText = msg;
      }
    }
  });

  if(isValid) {
    return validateDate();
  }
  return isValid;
}

function validateDate() {
  const elements = [...calculatorForm.elements].filter((formElement) =>
    formElement.classList.contains("error-input")
  );
  // if (elements && elements.length > 0) {
  //   return;
  // }
  const day = Number(dayInput.value);
  const month = Number(monthInput.value);
  const year = Number(yearInput.value);
  const date = new Date(`${month}/${day}/${year}`);
  if (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  ) {
    return true;
  } else {
    [...calculatorForm.elements].forEach((formElement, index) => {
      formElement.classList.add("error-input");
      formElement.previousElementSibling.classList.add("error");
      formElement.nextElementSibling.innerText =
        index === 0 ? "Must be a valid date" : "";
    });
    return false;
  }
}


function generateAge() {
  const day = dayInput.value;
  const month = monthInput.value;
  const year = yearInput.value;
  const birthDate = new Date(`${month}/${day}/${year}`);

  const currentDate = new Date();

  const february = (birthDate.getFullYear() % 4 === 0 && birthDate.getFullYear() % 100 !== 0) || birthDate.getFullYear() % 400 === 0 ? 29 : 28;
  const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


  let yearsAlive;
  let monthsAlive;
  let daysAlive;

  yearsAlive = currentDate.getFullYear() - birthDate.getFullYear();
  monthsAlive = currentDate.getMonth() - birthDate.getMonth();


  // birthDate - 21/11/1993 currentDate - 30/05/2023
  // years = 2023 - 1993 = 30
  // months = 4 - 10 = -6 
  // years-- -> 29
  // months = -6 + 12 = 6
  // days ---> 30-21 = 9


  if(monthsAlive < 0) {
    yearsAlive--;
    monthsAlive = monthsAlive + 12;
  }

  daysAlive = currentDate.getDate() - birthDate.getDate();

  if(daysAlive < 0) {
    if (monthsAlive > 0) {
      monthsAlive--;
    } else {
      yearsAlive--;
      monthsAlive = 11;
    }
    daysAlive += daysInMonth[birthDate.getMonth()];
  }

  calculatedYears.innerText = yearsAlive;
  calculatedMonths.innerText = monthsAlive;
  calculatedDays.innerText = daysAlive;
  
}

function submitInput() {
  resetErrorState();
  const isValid = validateInputsFilled();
  if(isValid) {
    generateAge();
  }
}
