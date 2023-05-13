module.exports = {
    getPagination: (page, size, offset) => {
        const limit = size ? +size : 5;
        if (offset) {
            return { limit, offset };
        } else {
            offset = page ? page * limit : 0;
            return { limit, offset };
        }
    }
};
