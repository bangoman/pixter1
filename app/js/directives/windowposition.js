           function getImgSizeforwindow(imgSrc) {
			    var newImg = new Image();
			    newImg.onload = function () {
			        var height = newImg.height;
			        var width = newImg.width;
			        windowPositionSize(newImg);
			        console.log("newimg",newImg)

			    }

			    newImg.src = $scope.newProduct.images.oss.image; // this must be done AFTER setting onload
			}


			function windowPositionSize(image){
			 	$scope.product.window ={};
			 	$scope.product.width = image.width;
			 	$scope.product.height = image.height
				$scope.product.window.x = $scope.product.width * $scope.newProduct.images.oss.top_left_coord.x/100;
				$scope.product.window.y = $scope.product.height * $scope.newProduct.images.oss.top_left_coord.y/100;
				$scope.product.window.w = $scope.product.width * ($scope.newProduct.images.oss.bottom_right_coord.x - $scope.newProduct.images.oss.top_left_coord.x)/100;
				$scope.product.window.h = $scope.product.height * ($scope.newProduct.images.oss.bottom_right_coord.y - $scope.newProduct.images.oss.top_left_coord.y)/100;
			    console.log("windowx",$scope.product.window.x)
			    console.log("windowy",$scope.product.window.y)
			    console.log("windoww",$scope.product.window.w)
			    console.log("windowh",$scope.product.window.h)
			    calculatePosition(image)

			} 

			$scope.newProduct = {
				"localization" : {
					"language" : "en-US",
					"currency" : {
						"code" : "USD",
						"display" : "$ USD",
						"symbol" : "$"
					}
				},	
				"id" : "FLAT660510EEEE", 
				"name" : "flatcard",
				"shortname" : "Flat Card",
				"description" : "describing the item",
				"information" : ["The best item ever", "Comes with everything", "Never buy anything again!"],
				"min_dpi" : "100",
				"num_of_images" : 1,
				"quantities" : [
					{
						"min" : 0,
						"max" : "10",
						"pricing" : {
							"price" : 14,
							"tax" : 0,
							"shipping" : [
								{
									"id" : "reg1",
									"type" : "regular",
									"name" : "snail mail",
									"text" : "Regular old Snail Mail",
									"price" : 1,
									"original_price" : 1
								},
								{
									"id" : "exp1",
									"type" : "express",
									"name" : "superman",
									"text" : "Superman express",
									"price" : 15,
									"original_price" : 15
								}				
							],
							"original_price" : 20,
							"campaign" : {
								"id" : "c00lcam7ai9n",
								"name" : "summer sale",
								"message" : "Hot Summer Sale! 30% OFF!",
								"code" : "5UMM3R",
								"type" : "percentprice",
								"discount" : "30",
								"shipping_discount" : null
							}
						}
					},
					{
						"min" : 11,
						"max" : "100",
						"pricing" : {
							"price" : 14,
							"tax" : 0,
							"shipping" : [
								{
									"id" : "reg1",
									"type" : "regular",
									"name" : "snail mail",
									"text" : "Regular old Snail Mail",
									"price" : 0,
									"original_price" : 1
								},
								{
									"id" : "exp1",
									"type" : "express",
									"name" : "superman",
									"text" : "Superman express",
									"price" : 0,
									"original_price" : 15
								}				
							],
							"original_price" : 20,
							"campaign" : {
								"id" : "c00lcam7ai9nfree",
								"name" : "summer sale",
								"message" : "Hot Summer Sale! 30% OFF!",
								"code" : "5UMM3R",
								"type" : "percentprice+freeshipping",
								"discount" : "30",
								"shipping_discount" : 100
							}
						}
					}		
				],
				"images" : {
					"oss" : {
								"image" : "http://blogs-images.forbes.com/travisbradberry/files/2014/10/Toxic_people1.jpg",
								"hdimage" : null,
								"ratio" : 1.19,
								"top_left_coord" : {
									"x" : 50.96,
									"y" : 30.10
								},
								"bottom_right_coord" : {
									"x" : 92.74,
									"y" : 64.13
								},
								"rotation" : 13,
								"lr_rotation" : null,
								"tb_rotation" : null,
								"3d_conversion" : null
							},
							"preview" : {
								"image" : "pixter.s3.aws.com/images/flatcard/previewImage.png",
								"hdimage" : null,
								"ratio" : 1.19,
								"top_left_coord" : {
									"x" : 19.28,
									"y" : 31
								},
								"bottom_right_coord" : {
									"x" : 94.64,
									"y" : 61.33
								},
								"rotation" : 13,
								"lr_rotation" : null,
								"tb_rotation" : null,
								"3d_conversion" : null
							},
							"edit" : {
								"image" : "",
								"hdimage" : null,
								"ratio" : 0,
								"top_left_coord" : {
									"x" : 0,
									"y" : 0
								},
								"bottom_right_coord" : {
									"x" : 0,
									"y" : 0
								},
								"rotation" : 0,
								"lr_rotation" : null,
								"tb_rotation" : null,
								"3d_conversion" : null
							}	
				},
				"params" : [
					{
						"type" : "toggle",
						"title" : "Make it better?",
						"options" : [
							{
								"id" : "retteb1",
								"name" : "Better",
								"default" : true,
								"pricing" : {
									"price" : 0.7,
									"tax" : 0,
									"shipping" : null,
									"original_price" : 1,
									"campaign" : {
										"id" : "c00lcam7ai9nfree",
										"name" : "summer sale",
										"message" : "Hot Summer Sale! 30% OFF!",
										"code" : "5UMM3R",
										"type" : "percentprice+freeshipping",
										"discount" : "30",
										"shipping_discount" : 100
									}
								}

							},
							{
								"id" : "esrow1",
								"name" : "Worse",
								"default" : false,
								"pricing" : {
									"price" : 0,
									"tax" : 0,
									"shipping" : null,
									"original_price" : 0,
									"campaign" : {
										"id" : "c00lcam7ai9nfree",
										"name" : "summer sale",
										"message" : "Hot Summer Sale! 30% OFF!",
										"code" : "5UMM3R",
										"type" : "percentprice+freeshipping",
										"discount" : "30",
										"shipping_discount" : 100
									}
								},
								"placeholder" : null,
								"image" : null
							}
						]
					}
				],
				"related_product" : [
					{
						"id" : "PIX1111111",
						"name" : "Pixter item1",
						"description" : "describing the item1",
						"image" : "pixter.s3.aws.com/regimage1.jpg"
					}
				],
				"campaign" : {
					"id" : "c00lcam7ai9n",
					"name" : "summer sale",
					"message" : "Hot Summer Sale! 30% OFF!",
					"code" : "5UMM3R",
					"type" : "percentprice",
					"discount" : "30",
					"shipping_discount" : null
				}
			}
			getImgSizeforwindow($scope.newProduct.images.oss)

        },