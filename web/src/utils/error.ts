
export const formatError = (resError: any) => {
  let errStrg = resError.message;
  if (resError.errors) {
    errStrg += `:\n${resError.errors.join("\n")}`;
  }
  return errStrg;
}