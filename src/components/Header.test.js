import {render, screen} from '@testing-library/react';
import { toHaveClass } from '@testing-library/jest-dom';
import Header from './Header';

it("should render a button with the class of primary", () => {
    render(<Header />)
    const button = screen.getByRole('button', { button: /primary/i })
    expect(button).toHaveClass('primary')
})
