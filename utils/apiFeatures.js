const qs = require("qs");

class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = qs.parse(this.queryString);

        const excludesFields = ["page", "sort", "limit", "fields"];
        excludesFields.forEach((field) => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");

            console.log("🚀💥 --> ApiFeatures --> sort --> sortBy:", sortBy);

            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createAt");
        }
        return this;
    }

    limitingFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    search(modelName) {
        console.log(
            "🚀💥 --> ApiFeatures --> search --> modelName:",
            modelName
        );

        if (this.queryString.keywords) {
            const keyword = this.queryString.keywords.trim();

            let query = {};
            if (modelName === "Product") {
                query = {
                    $or: [
                        {title: {$regex: keyword, $options: "si"}},
                        {
                            description: {
                                $regex: keyword,
                                $options: "si",
                            },
                        },
                    ],
                };
            } else {
                query = {
                    name: {$regex: keyword, $options: "si"},
                };

                this.mongooseQuery = this.mongooseQuery.find(query);
            }
        }

        return this;
    }

    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 5;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        const pagination = {};

        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPage = Math.ceil(countDocuments / limit);

        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginateResult = pagination;
        return this;
    }
}
module.exports = ApiFeatures;
