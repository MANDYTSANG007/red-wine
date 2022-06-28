//This is where you list all your components.


import './Discovery.css';
import Logo from './Logo';
import Body from './Body';
import Button from './Button';
import Suggest from './Suggest';
import Rating from './Rating';
import FormInput from './FormInput';
import Form from './Form'; 
import {useRef, useState} from 'react';
import Actions from './Actions';
import Dialog from './Dialog';
import Header from './Header';
import ExcelF from './ExcelF';

import schema from '../config/schema';



//Generic dialog  for any sort of messages
function DialogExample() {
    const [example, setExample] = useState(null);
    return (
        <>
            <p>
                <Button onClick={() => setExample(1)}>Example 1</Button>{' '}
                <Button onClick={() => setExample(2)}>Example 2</Button>
            </p>
            {example === 1 ? (
                <Dialog
                    modal   //modal takes over the whole app and nothing really happens until it's dismissed
                    header='Out-of-the-box example'
                    onAction={(type) => {
                        alert(type);
                        setExample(null);
                    }}>
                        Hello, dialog!
                    </Dialog>
            ) : null }

            {example === 2 ? (
                <Dialog
                    modal
                    header="Not modal, custom dismiss button"
                    hasCancel={false}
                    confirmLabel='Whatever'
                    onAction={(type) => {
                        alert(type);
                        setExample(null);
                    }}>
                        Anything goes here, like a <Button> a button </Button> for example
                </Dialog>
            ) : null}
        </>
    )
};

function Discovery() {
    const form = useRef(); // add
    return (
        <div className='Discovery'>
            <h2> Logo </h2>
            <div style={{ background: '#f6f6f6', display: 'inline-block' }}>
                <Logo />
            </div>
            <h2>Header</h2>
            <Header
                onSearch={(e) => console.log(e)}
                onAdd={() => alert('add')}
                count={2}
            />

            <h2>Body</h2>
            <Body>Content</Body>

            <h2>Button</h2>
            <p>
                Button with onClick: {' '}
                <Button onClick={() => alert('ouch')}>Click me</Button>
            </p>
            <p>
                A link: <Button href="https://reactjs.org/">Follow me</Button>
            </p>
            <p>
                Custom class name: {' '}
                <Button className="Discovery-custom-button">I do nothing</Button>
            </p>

            <h2>Rating</h2>
            <p>
                No initial value: <Rating />
            </p>
            <p>
                Initial value 4: <Rating defaultValu={4} />
            </p>
            <p>
                This one goes to 11: <Rating max={11} />
            </p>
            <p>
                Read-only: <Rating readonly={true} defaultValue={3} />
            </p>

            <h2>Suggest</h2>
            <p>
                <Suggest options={['eenie', 'meenie', 'miney', 'mo']} />
            </p>
            
            <h2>Form inputs</h2>
            <table className='Discovery-pad'>
                <tbody>
                    <tr>
                        <td>Vanilla input</td>
                        <td><FormInput /></td>
                    </tr>
                    <tr>
                        <td>Prefilled</td>
                        <td><FormInput defaultValue='with a default' /></td>
                    </tr>
                    <tr>
                        <td>Year</td>
                        <td><FormInput type='year' /></td>
                    </tr>
                    <tr>
                        <td>Rating</td>
                        <td><FormInput type='rating' defaultValue={4} /></td>
                    </tr>
                    <tr>
                        <td>Suggest</td>
                        <td>
                            <FormInput
                                type='suggest'
                                options={['red', 'green', 'blue']}
                                defaultValue='green'
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Vanilla textarea</td>
                        <td><FormInput type='textarea' /></td>
                    </tr>
                </tbody>
            </table>

            <h2>Form</h2>
            <div className='Discovery-pad Discovery-narrow'>
                <Form
                ref={form}
                fields={{
                    rateme: {label: 'Rating', type: 'rating'},
                    freetext: {label: 'Greeting'},
                }}
                initialData={{rateme:4, freetext: 'Hello'}}
            />
            <p>
                <Button
                    onClick={() => {
                        const data = {};
                        Array.from(form.current).forEach(
                            (input)=> (data[input.id] =input.value),
                        );
                        alert(JSON.stringify(data));
                    }}>
                    Submit </Button>
            </p>
            </div>
            
            <h3>Readonly form</h3>
            <div className='Discovery-pad'>
                <Form
                    fields={{
                        rateme: {label: 'Rating', type: 'rating'},
                        freetext: {label: 'Greetings'},
                    }}
                    initialData={{rateme: 4, freetext: 'Hello'}}
                    readonly
                />
            </div>

            <h2> Action </h2>
            <p>
                <Actions onAction={(type) => alert(type)} />
            </p>

            <h2>Dialog</h2>
            <DialogExample />

            <h2>Excel</h2>
            <ExcelF
                schema={schema}
                initialData={schema.name.samples.map((_, idx) => {
                    const element = {};
                    for (let key in schema) {
                        element[key] = schema[key].samples[idx];
                    }
                    return element;
                })}
                onDataChange={(data) => {
                    console.log(data);
                }}
            />
        </div>
    );
}

export default Discovery;




//work on the lowest-level components first: Actions, Body, Button, Dialog, Form, FormInput,
//Log, Rating, Suggest, TextAreaCounter

// Highest-level component: Header (made up of logo, search box, and an 'Add' button to add
// new records to the data table), Excel should be tackled second.