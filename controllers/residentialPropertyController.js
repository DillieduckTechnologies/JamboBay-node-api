const ResidentialProperty = require('../models/residentialProperty');
const PropertyImage = require('../models/residentialPropertyImage');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../helpers/responseHelper');


exports.createProperty = async (req, res, next) => {
  try {
    const {
      name,
      category,
      listing_type,
      description,
      physical_address,
      city,
      county,
      latitude,
      longitude,
      price,
      bedrooms,
      bathrooms,
      size_sqft,
      available_from,
      company_id,
      agent_id,
    } = req.body;

    const newProperty = await ResidentialProperty.create({
      name,
      category,
      listing_type,
      description,
      physical_address,
      city,
      county,
      latitude,
      longitude,
      price,
      bedrooms,
      bathrooms,
      size_sqft,
      available_from,
      company_id,
      agent_id,
      added_by: req.user.id,
    });

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        property_id: newProperty.id,
        image: file.path,
        caption: file.originalname || null,
        is_primary: index === 0, // first image as primary
      }));

      await PropertyImage.addImages(images);
    }

    logger.info(`Property created successfully: ${newProperty.id}`);
    return res.json(successResponse("Property created successfully", newProperty, 201));
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    const updatedProperty = await ResidentialProperty.update(id, updatedData);

    if (!updatedProperty)
      return res.json(errorResponse("Not found", "Property not found", 404));

    // Handle image uploads if provided
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        property_id: id,
        image: file.path,
        caption: file.originalname || null,
        is_primary: index === 0,
      }));
      await PropertyImage.addImages(images);
    }

    logger.info(`Property updated successfully: ${id}`);
    return res.json(successResponse("Property created successfully", updatedProperty, 201));

  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};



exports.getProperties = async (req, res) => {
  try {
    const properties = await ResidentialProperty.findAll();
    if (!properties.length) {
      return res.status(200).json(successResponse("Residential properties fetched successfully", [], 200));
    }

    const propertyIds = properties.map(p => p.id);
    const allImages = await PropertyImage.findByPropertyIds(propertyIds);

    const imagesByProperty = allImages.reduce((acc, img) => {
      if (!acc[img.property_id]) acc[img.property_id] = [];
      acc[img.property_id].push({
        id: img.id,
        image: img.image || img.image_path,
        caption: img.caption,
        is_primary: img.is_primary,
      });
      return acc;
    }, {});

    const propertiesWithImages = properties.map(p => ({
      ...p,
      images: imagesByProperty[p.id] || [],
    }));

    return res.json(successResponse("Residential properties fetched successfully", propertiesWithImages, 200));

  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};


exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await ResidentialProperty.findById(id);
    if (!property)
      return res.json(errorResponse("Not found", "Property not found", 404));

    const images = await PropertyImage.findByPropertyId(id);
    const response = { ...property, images };
    return res.json(successResponse("Residential property fetched successfully", response, 200));
  } catch (error) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await ResidentialProperty.delete(id);
    return res.json(successResponse("Residential property deleted successfully", id, 201));
  } catch (err) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};

exports.uploadPropertyImage = async (req, res) => {
  try {
    const { caption, is_primary } = req.body;
    const image = req.file
      ? `uploads/property_images/${req.file.filename}`
      : null;

    const imageData = {
      property_id: req.params.id,
      image,
      caption,
      is_primary: is_primary === 'true',
    };
    const savedImage = await PropertyImage.addImage(imageData);

    return res.json(successResponse("Property image uploaded successfully", savedImage, 201));
  } catch (error) {
    logger.error('An error occurred: ' + err);
    return res.json(errorResponse("An error occurred", err.message, 400));
  }
};
