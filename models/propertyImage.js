const db = require('../db/connection');

const PropertyImage = {
  async addImages(images) {
    const result = await db('residential_property_images')
      .insert(images)
      .returning('*')
      .catch(() => null);

    if (result && result.length) {
      return result;
    }

    if (images.length) {
      const propertyId = images[0].property_id;
      return this.findByPropertyId(propertyId);
    }

    return [];
  },

  async addImage(image) {
    const result = await db('residential_property_images').insert(image);
    
    if (result && result.length) {
      const id = result[0];
      return this.findByPropertyId(propertyId);
    }
  },

  async findByPropertyId(property_id) {
    return db('residential_property_images')
      .where({ property_id })
      .orderBy('uploaded_at', 'desc');
  },

  async findByPropertyIds(propertyIds) {
    return db('residential_property_images')
      .whereIn('property_id', propertyIds)
      .orderBy('property_id', 'asc')
      .orderBy('uploaded_at', 'desc');
  },

  async delete(id) {
    return db('residential_property_images').where({ id }).del();
  },
};

module.exports = PropertyImage;
