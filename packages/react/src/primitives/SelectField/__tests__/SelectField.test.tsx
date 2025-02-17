import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ComponentClassNames } from '../../shared';
import { SelectField } from '../SelectField';
import {
  testFlexProps,
  expectFlexContainerStyleProps,
} from '../../Flex/__tests__/Flex.test';
import { AUTO_GENERATED_ID_PREFIX } from '../../utils/useStableId';
describe('SelectField test suite', () => {
  const className = 'my-select';
  const descriptiveText = 'This is a descriptive text';
  const id = 'my-select';
  const label = 'Number';
  const role = 'combobox';
  const testId = 'test-select';
  const errorMessage = 'This is an error message';
  describe('Flex wrapper', () => {
    it('should render default and custom classname ', async () => {
      render(
        <SelectField label={label} testId={testId} className={className}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const selectField = await screen.findByTestId(testId);
      expect(selectField).toHaveClass(className);
      expect(selectField).toHaveClass(ComponentClassNames.Field);
      expect(selectField).toHaveClass(ComponentClassNames.SelectField);
    });

    it('should render all flex style props', async () => {
      render(
        <SelectField label={label} testId={testId} {...testFlexProps}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const selectField = await screen.findByTestId(testId);
      expectFlexContainerStyleProps(selectField);
    });
  });

  describe('Label', () => {
    it('should render expected field classname', async () => {
      render(
        <SelectField label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const labelElelment = (await screen.findByText(
        label
      )) as HTMLLabelElement;
      expect(labelElelment).toHaveClass(ComponentClassNames.Label);
    });

    it('should match select id', async () => {
      render(
        <SelectField label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const labelElelment = (await screen.findByText(
        label
      )) as HTMLLabelElement;
      const select = await screen.findByRole(role);
      expect(labelElelment).toHaveAttribute('for', select.id);
    });

    it('should have `amplify-visually-hidden` class when labelHidden is true', async () => {
      render(
        <SelectField label={label} labelHidden>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const labelElelment = await screen.findByText(label);
      expect(labelElelment).toHaveClass('amplify-visually-hidden');
    });
  });

  describe('Select control', () => {
    it('should render expected id for select control', async () => {
      render(
        <SelectField id={id} label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const select = await screen.findByRole(role);
      expect(select).toHaveAttribute('id', id);
    });

    it('should forward ref to DOM element', async () => {
      const ref = React.createRef<HTMLSelectElement>();
      render(
        <SelectField id={id} label={label} ref={ref}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      await screen.findByRole(role);
      expect(ref.current?.nodeName).toBe('SELECT');
    });

    it('should render labeled select field when id is provided', async () => {
      render(
        <SelectField id={id} label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const field = await screen.findByLabelText(label);
      expect(field).toHaveClass(ComponentClassNames.Select);
      expect(field.id).toBe(id);
    });

    it('should render labeled select when id is not provided, and is autogenerated', async () => {
      render(
        <SelectField label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const field = await screen.findByLabelText(label);
      expect(field.id.startsWith(AUTO_GENERATED_ID_PREFIX)).toBe(true);
      expect(field).toHaveClass(ComponentClassNames.Select);
    });
  });

  it('should render the state attributes', async () => {
    render(
      <SelectField label={label} className={className} isDisabled isRequired>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );

    const select = await screen.findByRole(role);
    expect(select).toBeDisabled();
    expect(select).toBeRequired();
  });

  it('should set size and variation data attributes', async () => {
    render(
      <SelectField label={label} testId={testId} size="small" variation="quiet">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );

    const selectField = await screen.findByTestId(testId);
    const select = await screen.findByRole(role);
    expect(selectField).toHaveAttribute('data-size', 'small');
    expect(select).toHaveAttribute('data-variation', 'quiet');
  });

  it('can set defaultValue', async () => {
    render(
      <SelectField label={label} defaultValue="1">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );

    const select = await screen.findByRole(role);
    expect(select).toHaveValue('1');
  });

  it('has aria-invalid attribute when hasError is true', async () => {
    render(
      <SelectField label={label} hasError errorMessage="error">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );
    const select = await screen.findByRole(role);
    expect(select).toHaveAttribute('aria-invalid');
  });

  it('should fire event handlers', async () => {
    const onChange = jest.fn();
    render(
      <SelectField label={label} value="1" onChange={onChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );
    const select = await screen.findByRole(role);
    userEvent.selectOptions(select, '2');
    expect(onChange).toHaveBeenCalled();
  });

  describe('Descriptive message', () => {
    it('renders when descriptiveText is provided', async () => {
      render(
        <SelectField label={label} descriptiveText={descriptiveText}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const descriptiveField = await screen.queryByText(descriptiveText);
      expect(descriptiveField).toContainHTML(descriptiveText);
    });

    it('should map to descriptive text correctly', async () => {
      render(
        <SelectField label={label} descriptiveText={descriptiveText}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const select = await screen.findByRole(role);
      expect(select).toHaveAccessibleDescription(descriptiveText);
    });
  });

  describe('Error messages', () => {
    it("don't show when hasError is false", async () => {
      render(
        <SelectField label={label} errorMessage={errorMessage}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const errorText = await screen.queryByText(errorMessage);
      expect(errorText).not.toBeInTheDocument();
    });

    it('show when hasError and errorMessage', async () => {
      render(
        <SelectField label={label} errorMessage={errorMessage} hasError>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const errorText = await screen.queryByText(errorMessage);
      expect(errorText.innerHTML).toContain(errorMessage);
    });
  });

  describe('Options', () => {
    it('correctly maps the options prop to corresponding option tags with matching value, label and children', async () => {
      const optionStrings = ['lions', 'tigers', 'bears'];

      render(<SelectField label={label} options={optionStrings}></SelectField>);

      const selectFieldOptions = await screen.findAllByRole('option');
      expect(selectFieldOptions.length).toBe(optionStrings.length);

      selectFieldOptions.forEach((option, index) => {
        const optionString = optionStrings[index];
        expect(option).toHaveAttribute('value', optionString);
        expect(option).toHaveAttribute('label', optionString);
        expect(option.innerHTML).toBe(optionString);
      });
    });

    it('logs a warning to the console if the customer passes both children and options', async () => {
      const warningMessage =
        'Amplify UI: <SelectField> component  defaults to rendering children over `options`. When using the `options` prop, omit children.';
      const originalWarn = console.warn;
      console.warn = jest.fn();

      const optionStrings = ['lions', 'tigers', 'bears'];
      render(
        <SelectField label={label} options={optionStrings}>
          <option value="lions">lions</option>
          <option value="tigers">tigers</option>
          <option value="bears">bears</option>
        </SelectField>
      );

      expect(console.warn).toHaveBeenCalledWith(warningMessage);

      console.warn = originalWarn;
    });
  });
});
