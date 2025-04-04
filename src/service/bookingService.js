const Booking = require('../models/booking');
const { publishToQueue } = require("../queue/producer");

const createBooking = async (bookingData) => {
    try {
        const newBooking = {
            status: bookingData.status,
            id: bookingData.id,
            flight: bookingData.flight,
            user: bookingData.user
        }
        const response = await new Booking(newBooking).save();
         // Send booking details to RabbitMQ
        await publishToQueue({ type: "NEW_BOOKING", data: bookingData });
        return response;
    } catch (err) {
        console.log(err);
    }
}

const cancelBooking = async (id) => {
    try {
        const response = await Booking.findOneAndUpdate({id: id}, {status: 'cancelled'});
        console.log(response)
        return response;
    } catch(err) {
        console.log(err);
    }
}

const boardingPass = async (id) => {
    try {
        const response = await Booking.findOne({id: id})
                                .populate('flight')
                                .populate('user')
                                .exec();
        return response;
    } catch(err) {
        console.log(err);
    }
}   


module.exports = {
    createBooking,
    cancelBooking,
    boardingPass
}