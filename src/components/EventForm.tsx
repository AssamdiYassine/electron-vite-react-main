import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    date: yup.date().required('Date is required'),
});

interface EventFormData {
    title: string;
    date: string;
}

function EventForm() {
    const { handleSubmit, control, errors } = useForm<EventFormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: EventFormData) => {
        // Handle form submission here, you can add your code to create events in the calendar.
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Title</label>
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => <input {...field} />}
                />
                <p>{errors.title?.message}</p>
            </div>
            <div>
                <label>Date</label>
                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => <input type="date" {...field} />}
                />
                <p>{errors.date?.message}</p>
            </div>
            <button type="submit">Add Event</button>
        </form>
    );
}

export default EventForm;
