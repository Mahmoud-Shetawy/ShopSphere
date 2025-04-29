const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const {id} = req.params;

        const document = await Model.findByIdAndDelete({_id: id}, {new: true});
        if (!document) {
            return next(
                new ApiError(`No ${Model.modelName} For this id ${id}`, 404)
            );

            // res.status(404).json({mes: `No category for this id ${id}`});
        }
        res.status(204).send();
    });

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const documents = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        if (!documents) {
            return next(
                new ApiError(
                    `No ${Model.modelName} For this id ${req.params.id}`,
                    404
                )
            );
        }
        res.status(200).json({
            data: documents,
        });
    });

exports.createOne = (Model) =>
    asyncHandler(async (req, res) => {
        const documents = await Model.create(req.body);
        res.status(201).json({data: documents});
    });

exports.getOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const {id} = req.params;

        const documents = await Model.findById(id);
        if (!documents) {
            return next(
                new ApiError(`No ${Model.modelName} For this id ${id}`, 404)
            );
        }
        res.status(200).json({
            data: documents,
        });
    });

exports.getAll = (Model) =>
    asyncHandler(async (req, res) => {
        let filter = {};
        if (req.filterObj) {
            filter = req.filterObj;
        }
        const documentCount = await Model.countDocuments();

        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .search(Model.modelName)
            .limitingFields()
            .paginate(documentCount);

        const {mongooseQuery, paginateResult} = apiFeatures;
        const documents = await mongooseQuery;

        res.status(200).json({
            results: documents.length,
            paginateResult,
            data: documents,
        });
    });
