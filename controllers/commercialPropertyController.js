const CommercialProperty = require('../models/commercialProperty');
const PropertyImage = require('../models/commercialPropertyImage');
const logger = require('../utils/logger');
const { log } = require('winston');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.createProperty = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      physical_address,
      city,
      county,
      sub_county,
      ward,
      postal_code,

      latitude,
      longitude,
      auto_geocode,
      price,
      size_sqft,
      available_from,
      company_id,
      agent_id,
      
    } = req.body;

    const newProperty = await  CommercialProperty.create({
      name,
      category,
      description,
      physical_address,
      city,
      county,
      sub_county,
      ward,
      postal_code,

      latitude,
      longitude,
      auto_geocode,
      price,
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
    res.status(201).json({
      message: 'Property created successfully',
      property: newProperty,
    });
  } catch (err) {
    logger.error('Error creating property: ' + err);
    next(err);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    const updatedProperty = await CommercialProperty.update(id, updatedData);

    if (!updatedProperty)
      return res.status(404).json({ message: 'Property not found' });

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
    res.json({
      message: 'Property updated successfully',
      property: updatedProperty,
    });
  } catch (err) {
    logger.error('Error updating property: ' + err);
    next(err);
  }
};



exports.getProperties = async (req, res) => {
  try {
    const properties = await CommercialProperty.findAll();
    if (!properties.length) {
      return res.json([]);
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

    res.json(propertiesWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};


exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await CommercialProperty.findById(id);
    if (!property)
      return res.status(404).json({ message: 'Property not found' });

    const images = await PropertyImage.findByPropertyId(id);
    res.json({ ...property, images });
  } catch (error) {
    logger.error('Error fetching property by ID: ' + error);
    res.status(500).json({ message: 'Error fetching property', error });
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await CommercialProperty.delete(id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error });
  }
};

exports.uploadPropertyImage = async (req, res) => {
  try {
    const { caption, is_primary } = req.body;
    const image = req.file
      ? `uploads/property_images/${req.file.filename}`
      : null;

    const imageData = {
       property_id : req.params.id,
      image,
      caption,
      is_primary: is_primary === 'true',
    };
    const savedImage = await PropertyImage.addImage(imageData);
    console.log('Saved Image:', savedImage);

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: savedImage,
    });
  } catch (error) {
    logger.error('Error uploading property image: ' + error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
};
