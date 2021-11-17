export const ERRORS = { 
  NO_ID: "You need to specify a resource id in the URL",
  NOT_FOUND: "Not found. There is no object with this id",
  NO_BODY: "There is no body to the request. POST/PATCH request must have a JSON body",
}

export const JoiOptions = {
  convert: false,
  dateFormat: 'date'
}