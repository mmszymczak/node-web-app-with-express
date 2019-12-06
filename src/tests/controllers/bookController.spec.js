require('should');
const sinon = require('sinon');
const navigation = require('../../config/navigation');
const mongoService = require('../../services/mongoService');
const bookService = require('../../services/goodreadsService');
const bookController = require('../../controllers/bookController');

describe('Book Controller', () => {
  describe('ALL - idMiddleware', () => {
    const res = {
      status: sinon.spy(),
      send: sinon.spy(),
    };
    const next = sinon.spy();
    let controller;

    it('should call the next function if id exists in params', () => {
      const req = {
        params: {
          id: 77,
        },
      };
      controller = bookController(bookService, navigation);
      controller.idMiddlewear(req, res, next);

      next.called.should.equal(true);
    });

    it('should response with a status of 400 when id is not passed in params', () => {
      const req = {
        params: {},
      };
      controller = bookController(bookService, navigation);
      controller.idMiddlewear(req, res, next);

      res.status.calledWith(400).should.equal(true);
      res.send.calledWith('Book id is required.').should.equal(true);
    });
  });

  describe('GET - getDetailsById', () => {
    const sampleBook = {
      authors: {
        author: { name: 'John' },
      },
    };
    const req = {
      params: {
        id: 77,
      },
    };
    const res = {
      status: sinon.spy(),
      render: sinon.spy(),
    };
    let getBookByIdStub;
    let controller;

    beforeEach(async () => {
      getBookByIdStub = sinon.stub(bookService, 'getBookById');
      getBookByIdStub.resolves(sampleBook);

      controller = bookController(bookService, navigation);
      await controller.getDetailsById(req, res);
    });

    afterEach(() => {
      getBookByIdStub.restore();
    });

    it('should get the appropriate book based on its id', () => {
      getBookByIdStub.calledWith(req.params.id).should.equal(true);
    });

    it('should render bookView page', () => {
      res.render.calledWith('bookView', sinon.match.object).should.equal(true);
    });
  });

  describe('POST - addToLibrary', () => {
    const sampleBook = {
      authors: {
        author: { name: 'John' },
      },
    };
    const collectionMock = {
      insertOne: sinon.stub(),
    };
    const req = {
      params: {
        id: 77,
      },
    };
    const res = {
      status: sinon.spy(),
      render: sinon.spy(),
    };
    let getBookByIdStub;
    let getCollectionStub;
    let controller;

    beforeEach(async () => {
      getBookByIdStub = sinon.stub(bookService, 'getBookById');
      getCollectionStub = sinon.stub(mongoService, 'getCollection');
      mongoService.closeConnection = sinon.spy();
      getBookByIdStub.resolves(sampleBook);
      getCollectionStub.resolves(collectionMock);
      collectionMock.insertOne.resolves();

      controller = bookController(bookService, navigation);
      await controller.addToLibrary(req, res);
    });

    afterEach(() => {
      getCollectionStub.restore();
      getBookByIdStub.restore();
    });

    it('should get books collection', () => {
      getCollectionStub.calledWith('books').should.equal(true);
    });

    it('should get the appropriate book based on its id', () => {
      getBookByIdStub.calledWith(req.params.id).should.equal(true);
    });

    it('should insert prepared book to collection', () => {
      collectionMock.insertOne.called.should.equal(true);
    });

    it('should response with status 201', () => {
      res.status.calledWith(201).should.equal(true);
    });

    it('should close database connection', () => {
      mongoService.closeConnection.called.should.equal(true);
    });
  });
});
