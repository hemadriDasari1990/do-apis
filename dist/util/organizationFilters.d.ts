declare const userLookup: {
  departmentsLookup: {
    $lookup: {
      from: string;
      let: {
        departments: string;
      };
      pipeline: (
        | {
            $lookup: {
              from: string;
              let: {
                projects: string;
              };
              pipeline: (
                | {
                    $lookup: {
                      from: string;
                      let: {
                        boards: string;
                      };
                      pipeline: (
                        | {
                            $lookup: {
                              from: string;
                              let: {
                                sections: string;
                              };
                              pipeline: (
                                | {
                                    $match: {
                                      $expr: {
                                        $in: (
                                          | string
                                          | {
                                              $ifNull: (string | never[])[];
                                            }
                                        )[];
                                      };
                                    };
                                    $sort?: undefined;
                                  }
                                | {
                                    $sort: {
                                      _id: number;
                                    };
                                    $match?: undefined;
                                  }
                              )[];
                              as: string;
                            };
                          }
                        | {
                            $addFields: {
                              sections: string;
                              totalSections: {
                                $size: {
                                  $ifNull: (string | never[])[];
                                };
                              };
                            };
                          }
                        | {
                            $match: {
                              $expr: {
                                $in: (
                                  | string
                                  | {
                                      $ifNull: (string | never[])[];
                                    }
                                )[];
                              };
                            };
                            $sort?: undefined;
                          }
                        | {
                            $sort: {
                              _id: number;
                            };
                            $match?: undefined;
                          }
                      )[];
                      as: string;
                    };
                  }
                | {
                    $lookup: {
                      from: string;
                      let: {
                        boards: string;
                      };
                      pipeline: {
                        $match: {
                          $expr: {
                            $in: (
                              | string
                              | {
                                  $ifNull: (string | never[])[];
                                }
                            )[];
                          };
                          status: string;
                        };
                      }[];
                      as: string;
                    };
                  }
                | {
                    $addFields: {
                      boards: string;
                      inProgressBoards: string;
                      newBoards: string;
                      completedBoards: string;
                      totalBoards: {
                        $size: {
                          $ifNull: (string | never[])[];
                        };
                      };
                      totalInProgressBoards: {
                        $size: {
                          $ifNull: (string | never[])[];
                        };
                      };
                      totalNewBoards: {
                        $size: {
                          $ifNull: (string | never[])[];
                        };
                      };
                      totalCompletedBoards: {
                        $size: {
                          $ifNull: (string | never[])[];
                        };
                      };
                    };
                  }
                | {
                    $match: {
                      $expr: {
                        $in: (
                          | string
                          | {
                              $ifNull: (string | never[])[];
                            }
                        )[];
                      };
                    };
                    $sort?: undefined;
                  }
                | {
                    $sort: {
                      _id: number;
                    };
                    $match?: undefined;
                  }
              )[];
              as: string;
            };
          }
        | {
            $lookup: {
              from: string;
              let: {
                projects: string;
              };
              pipeline: {
                $match: {
                  $expr: {
                    $in: (
                      | string
                      | {
                          $ifNull: (string | never[])[];
                        }
                    )[];
                  };
                  status: string;
                };
              }[];
              as: string;
            };
          }
        | {
            $lookup: {
              from: string;
              let: {
                projects: string;
              };
              pipeline: {
                $match: {
                  $expr: {
                    $in: (
                      | string
                      | {
                          $ifNull: (string | never[])[];
                        }
                    )[];
                  };
                  private: boolean;
                };
              }[];
              as: string;
            };
          }
        | {
            $addFields: {
              projects: string;
              activeProjects: string;
              inActiveProjects: string;
              privateProjects: string;
              publicProjects: string;
              totalProjects: {
                $size: {
                  $ifNull: (string | never[])[];
                };
              };
              totalActiveProjects: {
                $size: {
                  $ifNull: (string | never[])[];
                };
              };
              totalInActiveProjects: {
                $size: {
                  $ifNull: (string | never[])[];
                };
              };
              totalPrivateProjects: {
                $size: {
                  $ifNull: (string | never[])[];
                };
              };
              totalPublicProjects: {
                $size: {
                  $ifNull: (string | never[])[];
                };
              };
            };
          }
        | {
            $match: {
              $expr: {
                $in: (
                  | string
                  | {
                      $ifNull: (string | never[])[];
                    }
                )[];
              };
            };
            $sort?: undefined;
          }
        | {
            $sort: {
              _id: number;
            };
            $match?: undefined;
          }
      )[];
      as: string;
    };
  };
  activeDepartmentsLookup: {
    $lookup: {
      from: string;
      let: {
        departments: string;
      };
      pipeline: {
        $match: {
          $expr: {
            $in: (
              | string
              | {
                  $ifNull: (string | never[])[];
                }
            )[];
          };
          status: string;
        };
      }[];
      as: string;
    };
  };
  inActiveDepartmentsLookup: {
    $lookup: {
      from: string;
      let: {
        departments: string;
      };
      pipeline: {
        $match: {
          $expr: {
            $in: (
              | string
              | {
                  $ifNull: (string | never[])[];
                }
            )[];
          };
          status: string;
        };
      }[];
      as: string;
    };
  };
  departmentAddFields: {
    $addFields: {
      departments: string;
      totalDepartments: {
        $size: {
          $ifNull: (string | never[])[];
        };
      };
    };
  };
};
export { userLookup };
