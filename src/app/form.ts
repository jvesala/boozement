export const handleFieldUpdate = (
    e: any,
    dispatch: any,
    dispatchFunc: any,
    validityFunc: any
) => {
    dispatch(dispatchFunc(e.target.value));
    const fieldValid = e.target.value.length === 0 || e.target.validity.valid;
    validityFunc(fieldValid);
};

export const updateValidity = (e: any, setDisabled: any) => {
    setDisabled(!e.target.closest('form').checkValidity());
};
