
// This is our middleware to check or validate with define JOISchema that we have created using "JOI" library
// against the form data which is entered by users. 
const validate = (schema) => async (req, res, next) => {
    
  const { error, value } =  await schema.validate(req.body, { abortEarly: false });

  if (error) {
    const validation_error = {
      status: 400,
      message: "Fill the field properly",
      extraDetails: error.details.map((err) => ({
        field: err.path[0],      // 👈 field name
        message: err.message,
        type: err.type    // 👈 error message
      })),
    };
    return next(validation_error);
  }

  req.body = value; // sanitized and validated data
  next();
};

module.exports = validate;


// What JOI actually gives you (error.details)
// Each item inside error.details looks like this:
// {
//   message: '"name" is required',
//   path: ['name'],
//   type: 'any.required',
//   context: {
//     label: 'name',
//     key: 'name'
//   }
// }