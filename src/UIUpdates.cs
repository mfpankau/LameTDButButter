using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UIUpdates : MonoBehaviour
{
    public Text moneyText;
    public Text healthText;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        moneyText.text = "$         " + Overseer.cash.ToString();
        healthText.text = Overseer.health.ToString() + " ♥";
    }
}
