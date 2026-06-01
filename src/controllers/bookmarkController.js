import bookmarkService from '../services/bookmarkService.js';

export const addBookmarkHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await bookmarkService.addBookmark({
      userId,
      jobId: req.body.jobId,
    });

    return res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ status: 'failed', message: error.message });
  }
};

export const getBookmarksHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await bookmarkService.getBookmarks(userId);

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};