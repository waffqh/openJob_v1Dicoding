import companyService from "../services/companyService.js";
import cache from "../utils/cache.js";

export const addCompanyHandler = async (req, res) => {
  try {
    const result = await companyService.addCompany(req.body);

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error.name === "InvariantError") {
      return res.status(400).json({
        status: "failed",
        message: failed.message,
      });
    }

    return res.status(500).json({
      status: "failed",
      message: "internal server error",
    });
  }
};

export const getCompaniesHandler = async (req, res) => {
  try {
    const companies = await companyService.getCompanies();

    return res.status(200).json({
      status: "success",
      data: {
        companies,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const getCompanyByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await companyService.getCompanyById(id);
    const cacheKey = `companies:${id}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      res.set("X-Data-Source", "cache");
      return res.status(200).json({
        status: "success",
        data: cached,
      });
    }

    res.set("X-Data-Source", "database");

    await cache.set(cacheKey, company);
    return res.status(200).json({
      status: "success",
      data: company,
    });
  } catch (error) {
    return res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const updateCompanyHandler = async (req, res) => {
  try {
    await companyService.updateCompanyById(req.params.id, req.body);

    return res.status(200).json({
      status: "success",
      message: "company berhasil diperbarui",
    });
  } catch (error) {
    return res.status(404).json({
      status: "success",
      message: error.message,
    });
  }
};

export const deleteCompanyHandler = async (req, res) => {
  try {
    await companyService.deleteCompanyById(req.params.id);

    return res.status(200).json({
      status: "success",
      message: "company berhasil dihapus",
    });
  } catch (error) {
    return res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
};
