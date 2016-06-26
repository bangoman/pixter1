import json
import os
import pickle

def get_gingle(strin):
	# return '0' + strin + '0'
	return strin

def get_trans_json_for_file(filetype,filename=None, filesuffix='default', filepath='/home/gilad/projects/client_v1/configurations'):
	#filetype = 'products'
	if not filename:
		filename = filetype + '_' + filesuffix + '.json'
	fullpath = filepath + '/' + filetype + '/' + filename
	try:
		with open(fullpath) as data_file: 
			jdata = json.load(data_file)
	except Exception as e:
		print e
		print filename
		return {}

	transj = {}
	if filetype == 'products':
		for obj in jdata['categories']:
			transj[obj['shortName']] = get_gingle(obj['shortName'])
			transj[obj['marketingName']] = get_gingle(obj['marketingName']) 
			transj[obj['categoryText']] = get_gingle(obj['categoryText'])

		for obj in jdata['products']:
			transj[obj['shortName']] = get_gingle(obj['shortName']) 
			transj[obj['marketingName']] = get_gingle(obj['marketingName'])  
			transj[obj['bulletList'][0]] = get_gingle(obj['bulletList'][0])  
			transj[obj['bulletList'][1]] = get_gingle(obj['bulletList'][1]) 
			transj[obj['bulletList'][2]] = get_gingle(obj['bulletList'][2])
			try:
				transj[obj['expressCheckoutText']] = get_gingle(obj['expressCheckoutText'])
			except Exception as e:
				print e
				print filename
				pass

	if filetype == 'pricing':
		for key, value in jdata['products'].iteritems():
			for key2, value2 in value['shipping'].iteritems():
				for obj2 in value2:
					transj[obj2['text']] = get_gingle(obj2['text']) 
					transj[obj2['name']] = get_gingle(obj2['name']) 

	if filetype == 'branding':
		try:
			transj[jdata['share']['buttonTextOnRegular']] = get_gingle(jdata['share']['buttonTextOnRegular']) 
			transj[jdata['share']['buttonTextOnDiscount']] = get_gingle(jdata['share']['buttonTextOnDiscount']) 
		except Exception as e:
			print e
			print filename
			pass

		try:
			transj[jdata['marketingData']['sideBarData']['p_side_banner_top_title']] = get_gingle(jdata['marketingData']['sideBarData']['p_side_banner_top_title'])
			transj[jdata['marketingData']['sideBarData']['p_side_banner_top_sub_title']] = get_gingle(jdata['marketingData']['sideBarData']['p_side_banner_top_sub_title'])
			transj[jdata['marketingData']['sideBarData']['p_side_banner_bottom_title']] = get_gingle(jdata['marketingData']['sideBarData']['p_side_banner_bottom_title'])
			transj[jdata['marketingData']['sideBarData']['p_side_banner_bottom_sub_title']] = get_gingle(jdata['marketingData']['sideBarData']['p_side_banner_bottom_sub_title'])
			for obj in jdata['marketingData']['ossData']:
				transj[obj['h2']] = get_gingle(obj['h2'])
				transj[obj['p']] = get_gingle(obj['p'])
		except Exception as e:
			print e
			print filename
			pass

		try:
			transj[jdata['specialOffer']['catalog']] = get_gingle(jdata['specialOffer']['catalog']) 
			for key, value in jdata['specialOffer'].iteritems():
				if key[0:7]=='product':
					transj[value] = get_gingle(value)
		except Exception as e:
			print e
			print filename
			pass

	return transj

def merge_two_dicts(x, y):
    '''Given two dicts, merge them into a new dict as a shallow copy.'''
    z = x.copy()
    z.update(y)
    return z


def get_trans_json_for_folder(filetype, rootdir='/home/gilad/projects/client_v1/configurations/'):

	all_dict = {}

	for subdir, dirs, files in os.walk(rootdir+filetype):
	    for file in files:
	    	print 'working on file: ' + file
	    	a = get_trans_json_for_file(filetype, filename=file)
	    	curr_dict = all_dict.copy()
	    	# print curr_dict
	    	# print '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'
	    	all_dict = dict(a.items() + curr_dict.items())
	    	# print a
	    	# print '################################################'
	     #    print all_dict
	     #    print '--------------------------------------------------'	        

	return all_dict


def get_all(curr_file=None, new_file = None):
	curr_dict = {}
	if curr_file:
		with open(curr_file) as data_file: 
			curr_dict = json.load(data_file)

	if not new_file:
		new_file = curr_file + '.new'

	branding_dict = get_trans_json_for_folder('branding')
	products_dict = get_trans_json_for_folder('products')
	pricing_dict = get_trans_json_for_folder('pricing')
	all_dict = dict(branding_dict.items() + products_dict.items() + pricing_dict.items() + curr_dict.items())
	print '##################################'
	print json.dumps(all_dict, sort_keys=True)
	with open(new_file, 'wb') as handle:
		handle.write(json.dumps(all_dict, sort_keys=True))

	return all_dict