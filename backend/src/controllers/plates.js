import PlatesDataAccess from "../dataAccess/plates.js";
import { validatePlate } from "../helpers/validators.js";

export default class PlatesControllers {
  async getPlates() {
    try {
      const platesDataAccess = new PlatesDataAccess();
      const plates = await platesDataAccess.getPlates();

      return {
        success: true,
        statusCode: 200,
        body: plates,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        body: { text: "Error fetching plates", error: error.message },
      };
    }
  }

  async getAvailablePlates() {
    try {
      const platesDataAccess = new PlatesDataAccess();
      const plates = await platesDataAccess.getAvailablePlates();

      return {
        success: true,
        statusCode: 200,
        body: plates,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        body: { text: "Error fetching available plates", error: error.message },
      };
    }
  }

  async addPlate(plateData) {
    try {
      // ✅ VALIDAR input
      const { error, value } = validatePlate(plateData);
      if (error) {
        return {
          success: false,
          statusCode: 400,
          body: {
            text: "Validation error",
            errors: error.details.map((err) => err.message),
          },
        };
      }

      const platesDataAccess = new PlatesDataAccess();
      const result = await platesDataAccess.addPlate(value);

      return {
        success: true,
        statusCode: 201,
        body: result,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        body: { text: "Error creating plate", error: error.message },
      };
    }
  }

  async deletePlate(plateId) {
    try {
      const platesDataAccess = new PlatesDataAccess();
      const result = await platesDataAccess.deletePlate(plateId);

      if (!result.value) {
        return {
          success: false,
          statusCode: 404,
          body: { text: "Plate not found" },
        };
      }

      return {
        success: true,
        statusCode: 200,
        body: { text: "Plate deleted successfully", deletedId: result.value._id },
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        body: { text: "Error deleting plate", error: error.message },
      };
    }
  }

  async updatePlate(plateId, plateData) {
    try {
      // ✅ VALIDAR input
      const { error, value } = validatePlate(plateData);
      if (error) {
        return {
          success: false,
          statusCode: 400,
          body: {
            text: "Validation error",
            errors: error.details.map((err) => err.message),
          },
        };
      }

      const platesDataAccess = new PlatesDataAccess();
      const result = await platesDataAccess.updatePlate(plateId, value);

      if (!result.value) {
        return {
          success: false,
          statusCode: 404,
          body: { text: "Plate not found" },
        };
      }

      return {
        success: true,
        statusCode: 200,
        body: { text: "Plate updated successfully", updatedId: result.value._id },
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        body: { text: "Error updating plate", error: error.message },
      };
    }
  }
}
