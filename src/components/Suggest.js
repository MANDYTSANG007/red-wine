//it's possible to use the destructuring assignment to assign more than one property to a variable
// and at the same time define default values -- Suggest({ id, defaultValue='', options=[]})
function Suggest({ id, defaultValue = '', options=[] }) {       
    const randomid = Math.random().toString(16).substring(2);
    return (
        <>
            <input
                id = {id}
                list = {randomid}
                defaultValue = {defaultValue}
            />
            <datalist id = {randomid}>
                {options.map((item, idx) => (
                    <option value = {item} key = {idx} />
                ))}
            </datalist>
        </>
    )
};

export default Suggest;