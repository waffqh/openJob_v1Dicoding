import express from "express";
import usersService from "../services/usersService.js";
import validate from "../middleware/validate.js";
import authService from "../services/authService.js";
import { authSchema } from "../validators/authValidator.js";
import { userSchema } from "../validators/userValidator.js";
import auth from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

import {
  addCompanyHandler,
  getCompaniesHandler,
  getCompanyByIdHandler,
  updateCompanyHandler,
  deleteCompanyHandler,
} from "../controllers/companyController.js";

import { companySchema } from "../validators/companyValidator.js";

import categoryService from "../services/categoryService.js";
import { categorySchema } from "../validators/categoryValidator.js";

import jobService from "../services/jobService.js";
import { jobSchema } from "../validators/jobValidator.js";

import applicationService from "../services/applicationService.js";
import { applicationSchema } from "../validators/applicationValidator.js";

import bookmarkService from "../services/bookmarkService.js";
import { bookmarkSchema } from "../validators/bookmarkValidator.js";

const router = express.Router();

/* USERS */

router.post("/users",
  validate(userSchema),
  async (req, res) => {
    try {
      const result = await usersService.addUser(req.body);

      return res.status(201).json({
        status: "success",
        data: {
          addedUser: result,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.get("/users/:id", async (req, res) => {
  try {
    const user = await usersService.getUserById(
      req.params.id
    );

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

/* AUTHENTICATIONS */

router.post(
  "/authentications",
  validate(authSchema),
  async (req, res) => {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.put(
  "/authentications",
  async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const decoded = jwt.verify(
        refreshToken,
        "refreshsecret"
      );

      const accessToken = jwt.sign(
        { id: decoded.id },
        "accesssecret",
        {
          expiresIn: "3h",
        }
      );

      res.status(200).json({
        status: "success",
        data: {
          accessToken,
        },
      });
    } catch (error) {
      res.status(401).json({
        status: "failed",
        message: "Refresh token tidak valid",
      });
    }
  }
);

router.delete(
  "/authentications",
  async (req, res) => {
    try {
      const { refreshToken } = req.body;

      await pool.query({
        text: `
          DELETE FROM authentications
          WHERE token = $1
        `,
        values: [refreshToken],
      });

      res.status(200).json({
        status: "success",
        message: "Logout berhasil",
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

/* PROFILE */

router.get(
  "/profile",
  auth,
  async (req, res) => {
    res.status(200).json({
      status: "success",
      data: {
        userId: req.user.id,
        message: "Protected route berhasil diakses",
      },
    });
  }
);

/* COMPANIES */

router.post(
  "/companies",
  auth,
  validate(companySchema),
  addCompanyHandler
);

router.get(
  "/companies",
  getCompaniesHandler
);

router.get(
  "/companies/:id",
  getCompanyByIdHandler
);

router.put(
  "/companies/:id",
  auth,
  updateCompanyHandler
);

router.delete(
  "/companies/:id",
  auth,
  deleteCompanyHandler
);

/* CATEGORIES */

router.post(
  "/categories",
  auth,
  validate(categorySchema),
  async (req, res) => {
    try {
      const result =
        await categoryService.addCategory(
          req.body
        );

      res.status(201).json({
        status: "success",
        data: {
          addedCategory: result,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.get(
  "/categories",
  async (req, res) => {
    try {
      const categories =
        await categoryService.getCategories();

      res.status(200).json({
        status: "success",
        data: {
          categories,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.get(
  "/categories/:id",
  async (req, res) => {
    try {
      const category =
        await categoryService.getCategoryById(
          req.params.id
        );

      res.status(200).json({
        status: "success",
        data: {
          category,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.put(
  "/categories/:id",
  auth,
  async (req, res) => {
    try {
      await categoryService.updateCategoryById(
        req.params.id,
        req.body
      );

      res.status(200).json({
        status: "success",
        message: "Category updated",
      });
    } catch (error) {
      res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.delete(
  "/categories/:id",
  auth,
  async (req, res) => {
    try {
      await categoryService.deleteCategoryById(
        req.params.id
      );

      res.status(200).json({
        status: "success",
        message: "Category deleted",
      });
    } catch (error) {
      res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

/* JOBS */

router.post(
  "/jobs",
  auth,
  validate(jobSchema),
  async (req, res) => {
    try {
      const result =
        await jobService.addJob(req.body);

      res.status(201).json({
        status: "success",
        data: {
          addedJob: result,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.get(
  "/jobs",
  async (req, res) => {
    try {
      const jobs =
        await jobService.getJobs();

      res.status(200).json({
        status: "success",
        data: {
          jobs,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.get(
  "/jobs/:id",
  async (req, res) => {
    try {
      const job =
        await jobService.getJobById(
          req.params.id
        );

      res.status(200).json({
        status: "success",
        data: {
          job,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.get(
  "/jobs/company/:id",
  async (req, res) => {
    try {
      const jobs =
        await jobService.getJobsByCompanyId(
          req.params.id
        );

      res.status(200).json({
        status: "success",
        data: {
          jobs,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.get(
  "/jobs/category/:id",
  async (req, res) => {
    try {
      const jobs =
        await jobService.getJobsByCategoryId(
          req.params.id
        );

      res.status(200).json({
        status: "success",
        data: {
          jobs,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.put(
  "/jobs/:id",
  auth,
  async (req, res) => {
    try {
      await jobService.updateJobById(
        req.params.id,
        req.body
      );

      res.status(200).json({
        status: "success",
        message: "Job updated",
      });
    } catch (error) {
      res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.delete(
  "/jobs/:id",
  auth,
  async (req, res) => {
    try {
      await jobService.deleteJobById(
        req.params.id
      );

      res.status(200).json({
        status: "success",
        message: "Job deleted",
      });
    } catch (error) {
      res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);


/* APPLICATIONS */

router.post(
  "/applications",
  auth,
  validate(applicationSchema),
  async (req, res) => {
    try {
      const result =
        await applicationService.addApplication(
          req.body
        );

      res.status(201).json({
        status: "success",
        data: {
          addedApplication: result,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.get(
  "/applications",
  auth,
  async (req, res) => {
    try {
      const applications =
        await applicationService.getApplications();

      res.status(200).json({
        status: "success",
        data: {
          applications,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

/* BOOKMARKS */

router.post(
  "/bookmarks",
  auth,
  validate(bookmarkSchema),
  async (req, res) => {
    try {
      const result =
        await bookmarkService.addBookmark(
          req.body
        );

      res.status(201).json({
        status: "success",
        data: {
          addedBookmark: result,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

router.get(
  "/bookmarks",
  auth,
  async (req, res) => {
    try {
      const bookmarks =
        await bookmarkService.getBookmarks();

      res.status(200).json({
        status: "success",
        data: {
          bookmarks,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
);

export default router;